import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/* ------------------------------------------------------------------ */
/* Utils */
/* ------------------------------------------------------------------ */

function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function sanitizeFilename(filename: string) {
  const ext = filename.includes(".")
    ? filename.slice(filename.lastIndexOf(".")).toLowerCase()
    : ".jpg";
  const base = filename.includes(".")
    ? filename.slice(0, filename.lastIndexOf("."))
    : filename;
  const safeBase =
    base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "image";
  return { safeBase, ext };
}

/** Normalize dish name to a safe folder name, e.g. "Plantain (boiled)" -> "plantain-boiled" */
function sanitizeFolderName(dishName: string): string {
  const normalized = dishName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "other";
}

/* ------------------------------------------------------------------ */
/* Environment */
/* ------------------------------------------------------------------ */

const USE_S3 = process.env.USE_S3 === "true" || process.env.USE_S3 === "1";

const endpoint = process.env.DO_SPACES_ENDPOINT;
const region = process.env.DO_SPACES_REGION;
const bucket = process.env.DO_SPACES_BUCKET;
const key = process.env.DO_SPACES_KEY;
const secret = process.env.DO_SPACES_SECRET;

if (USE_S3) {
  if (!endpoint || !region || !bucket || !key || !secret) {
    throw new Error(
      "USE_S3 is true but missing required DO_SPACES_* environment variables"
    );
  }
}

/* ------------------------------------------------------------------ */
/* S3 Client (only when USE_S3 is true) */
/* ------------------------------------------------------------------ */

const s3: S3Client | null =
  USE_S3 && endpoint && region && key && secret
    ? new S3Client({
        endpoint,
        region: "us-east-1",
        forcePathStyle: false,
        credentials: {
          accessKeyId: key,
          secretAccessKey: secret,
        },
      })
    : null;

/* ------------------------------------------------------------------ */
/* Config */
/* ------------------------------------------------------------------ */

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/* ------------------------------------------------------------------ */
/* Public helpers */
/* ------------------------------------------------------------------ */

export function isUseS3(): boolean {
  return USE_S3;
}

export function getS3EnvStatus(): {
  USE_S3: boolean;
  DO_SPACES_ENDPOINT: boolean;
  DO_SPACES_REGION: boolean;
  DO_SPACES_BUCKET: boolean;
  DO_SPACES_KEY: boolean;
  DO_SPACES_SECRET: boolean;
  allRequired: boolean;
} {
  return {
    USE_S3: process.env.USE_S3 === "true" || process.env.USE_S3 === "1",
    DO_SPACES_ENDPOINT: !!process.env.DO_SPACES_ENDPOINT,
    DO_SPACES_REGION: !!process.env.DO_SPACES_REGION,
    DO_SPACES_BUCKET: !!process.env.DO_SPACES_BUCKET,
    DO_SPACES_KEY: !!process.env.DO_SPACES_KEY,
    DO_SPACES_SECRET: !!process.env.DO_SPACES_SECRET,
    allRequired:
      !!process.env.DO_SPACES_ENDPOINT &&
      !!process.env.DO_SPACES_REGION &&
      !!process.env.DO_SPACES_BUCKET &&
      !!process.env.DO_SPACES_KEY &&
      !!process.env.DO_SPACES_SECRET,
  };
}

export function getSpacesPublicUrl(objectKey: string): string {
  if (!bucket || !region) {
    throw new Error("DO_SPACES_BUCKET/DO_SPACES_REGION not set");
  }
  return `https://${region}.digitaloceanspaces.com/${bucket}/${objectKey}`;
}
export async function uploadToSpaces(
  body: Uint8Array,
  filename: string,
  contentType: string,
  dishName?: string | null
): Promise<string> {
  if (!USE_S3 || !s3 || !bucket) {
    throw new Error(
      "S3 upload is disabled or not configured (USE_S3 and DO_SPACES_*)"
    );
  }
  if (!ALLOWED_TYPES.includes(contentType)) {
    throw new Error("Unsupported file type");
  }
  if (body.length > MAX_FILE_SIZE) {
    throw new Error("File exceeds maximum allowed size");
  }

  const { safeBase, ext } = sanitizeFilename(filename);
  const folder = dishName ? sanitizeFolderName(dishName) : "other";
  const objectKey = `submissions/${folder}/${randomId()}-${safeBase}${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: body,
      ContentType: contentType,
      ACL: "public-read",
    })
  );

  return getSpacesPublicUrl(objectKey);
}

export async function ensureSpacesUrl(
  url: string,
  filename: string,
  mimeType?: string | null,
  dishName?: string | null
): Promise<string> {
  if (!USE_S3) return url;
  if (!url || !url.startsWith("data:")) return url;

  const match = url.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return url;

  const contentType = (mimeType ?? match[1] ?? "image/jpeg").trim();
  const binary = atob(match[2]);
  const body = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) body[i] = binary.charCodeAt(i);

  return uploadToSpaces(body, filename, contentType, dishName);
}
