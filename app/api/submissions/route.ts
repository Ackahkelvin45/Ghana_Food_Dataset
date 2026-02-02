import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { ensureSpacesUrl } from "@/src/lib/spaces";

enum DishTypes {
  YAM = "YAM",
  PLANTAIN = "PLANTAIN",
  KENKEY = "KENKEY",
  BANKU = "BANKU",
  KOKONTE = "KOKONTE",
  FUFU = "FUFU",
  JOLLOF = "JOLLOF",
  PLAIN_RICE = "PLAIN_RICE",
  WAAKYE = "WAAKYE",
  BREAD = "BREAD",
  KOKO = "KOKO",
  BEANS = "BEANS",
}

// Map form dish names to enum values
const dishNameMap: Record<string, DishTypes> = {
  "Yam": DishTypes.YAM,
  "Plantain (boiled)": DishTypes.PLANTAIN,
  "Kenkey": DishTypes.KENKEY,
  "Banku": DishTypes.BANKU,
  "Kokonte": DishTypes.KOKONTE,
  "Fufu": DishTypes.FUFU,
  "Jollof": DishTypes.JOLLOF,
  "Plain Rice": DishTypes.PLAIN_RICE,
  "Waakye": DishTypes.WAAKYE,
  "Bread": DishTypes.BREAD,
  "Koko": DishTypes.KOKO,
  "Beans (Gob3)": DishTypes.BEANS,
};

// Helper function to determine dish category
function getDishCategory(dishName: DishTypes): string {
  const riceYamPlantain = [DishTypes.YAM, DishTypes.PLANTAIN, DishTypes.JOLLOF, DishTypes.PLAIN_RICE, DishTypes.WAAKYE];
  if (riceYamPlantain.includes(dishName)) return "riceYamPlantain";
  if (dishName === DishTypes.KOKO) return "koko";
  if ([DishTypes.BANKU, DishTypes.FUFU, DishTypes.KOKONTE, DishTypes.KENKEY].includes(dishName)) return "bankuFufu";
  if (dishName === DishTypes.BREAD) return "bread";
  if (dishName === DishTypes.BEANS) return "gob3";
  return "";
}

type SubmissionRequest = {
  // Form2: Basic dish information
  dishName: string;
  noPersonInImage: boolean;
  mainImages?: Array<{
    url: string;
    filename: string;
    size?: number;
    mimeType?: string;
  }>;
  additionalImages?: Array<{
    url: string;
    filename: string;
    size?: number;
    mimeType?: string;
  }>;

  // Form3: Dish-specific metadata (conditional based on dish type)
  stew?: string;
  stewOther?: string;
  extraItems?: string[];
  extraItemsOther?: string;
  kokoItems?: string[];
  kokoItemsOther?: string;
  soupContext?: string;
  soupContextOther?: string;
  pepper?: string[];
  pepperOther?: string;
  breadType?: string;
  breadTypeOther?: string;
  breadServedWith?: string[];
  breadServedWithOther?: string;
  gob3ServedWith?: string[];
  gob3ServedWithOther?: string;
  proteinContext?: string[];
  proteinContextOther?: string;

  // Form4: Location information
  region: string;
  town?: string;
  foodObtained: string;
  foodObtainedOther?: string;

  // Form5: Contributor information (optional)
  wantsAcknowledgement?: boolean;
  acknowledgedName?: string;
  acknowledgedEmail?: string;
  acknowledgedPhone?: string;

  // Form6: Final confirmation
  accuracyConfirmed: boolean;
};

/**
 * @swagger
 * /api/submissions:
 *   post:
 *     summary: Create a new food submission
 *     description: Submit a new Ghanaian food image with metadata for the dataset
 *     tags: [Submissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmissionRequest'
 *     responses:
 *       201:
 *         description: Submission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubmissionResponse'
 *       400:
 *         description: Bad request - missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: Request) {
  try {
    const body: SubmissionRequest = await req.json();

    // Validate required fields
    if (!body.dishName || !body.region || !body.foodObtained) {
      return NextResponse.json(
        { error: "Missing required fields: dishName, region, foodObtained" },
        { status: 400 }
      );
    }

    // Map dish name to enum
    const dishType = dishNameMap[body.dishName];
    if (!dishType) {
      return NextResponse.json(
        { error: `Invalid dish name: ${body.dishName}` },
        { status: 400 }
      );
    }

    // Determine dish category
    const dishCategory = getDishCategory(dishType);

    // When USE_S3 is true: upload base64 images to S3 (DigitalOcean Spaces) and use public URLs.
    // When USE_S3 is false: keep image URLs as-is (e.g. base64 data URLs).
    const allImages = [
      ...(body.mainImages || []).map((img) => ({ ...img, type: "main" as const })),
      ...(body.additionalImages || []).map((img) => ({ ...img, type: "additional" as const })),
    ];
    const uploadedImages = await Promise.all(
      allImages.map(async (img) => ({
        url: await ensureSpacesUrl(img.url, img.filename, img.mimeType, body.dishName),
        filename: img.filename,
        type: img.type,
        size: img.size ?? null,
        mimeType: img.mimeType ?? null,
      }))
    );

    // Build base submission data
    const submissionData: any = {
      dishName: dishType,
      noPersonInImage: body.noPersonInImage ?? false,
      region: body.region,
      town: body.town || null,
      foodObtained: body.foodObtained,
      foodObtainedOther: body.foodObtainedOther || null,
      wantsAcknowledgement: body.wantsAcknowledgement ?? false,
      acknowledgedName: body.acknowledgedName || null,
      acknowledgedEmail: body.acknowledgedEmail || null,
      acknowledgedPhone: body.acknowledgedPhone || null,
      accuracyConfirmed: body.accuracyConfirmed ?? false,
      images: {
        create: uploadedImages.map((img) => ({
          url: img.url,
          filename: img.filename,
          type: img.type,
          size: img.size,
          mimeType: img.mimeType,
        })),
      },
    };

    // Add dish-specific metadata based on category
    if (dishCategory === "riceYamPlantain") {
      submissionData.riceYamPlantainMeta = {
        create: {
          stew: body.stew || null,
          stewOther: body.stewOther || null,
          extraItems: body.extraItems || [],
          extraItemsOther: body.extraItemsOther || null,
          proteinContext: body.proteinContext || [],
          proteinContextOther: body.proteinContextOther || null,
        },
      };
    } else if (dishCategory === "koko") {
      submissionData.kokoMeta = {
        create: {
          kokoItems: body.kokoItems || [],
          kokoItemsOther: body.kokoItemsOther || null,
        },
      };
    } else if (dishCategory === "bankuFufu") {
      submissionData.bankuFufuMeta = {
        create: {
          soupContext: body.soupContext || null,
          soupContextOther: body.soupContextOther || null,
          pepper: body.pepper || [],
          pepperOther: body.pepperOther || null,
          proteinContext: body.proteinContext || [],
          proteinContextOther: body.proteinContextOther || null,
        },
      };
    } else if (dishCategory === "bread") {
      submissionData.breadMeta = {
        create: {
          breadType: body.breadType || null,
          breadTypeOther: body.breadTypeOther || null,
          breadServedWith: body.breadServedWith || [],
          breadServedWithOther: body.breadServedWithOther || null,
        },
      };
    } else if (dishCategory === "gob3") {
      submissionData.gob3Meta = {
        create: {
          gob3ServedWith: body.gob3ServedWith || [],
          gob3ServedWithOther: body.gob3ServedWithOther || null,
          proteinContext: body.proteinContext || [],
          proteinContextOther: body.proteinContextOther || null,
        },
      };
    }

    // Create submission with all related data
    const submission = await prisma.submission.create({
      data: submissionData,
      include: {
        images: true,
        riceYamPlantainMeta: true,
        kokoMeta: true,
        bankuFufuMeta: true,
        breadMeta: true,
        gob3Meta: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        submission,
        message: "Submission created successfully",
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Submission error:", e);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: e.message || "Failed to create submission",
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/submissions:
 *   get:
 *     summary: Get food submissions
 *     description: Retrieve a list of food submissions with optional filtering and pagination
 *     tags: [Submissions]
 *     parameters:
 *       - in: query
 *         name: dishName
 *         schema:
 *           type: string
 *           enum: [Yam, Plantain (boiled), Kenkey, Banku, Kokonte, Fufu, Jollof, Plain Rice, Waakye, Bread, Koko, Beans (Gob3)]
 *         description: Filter by dish name
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter by region
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: List of submissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubmissionsListResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dishName = searchParams.get("dishName");
    const region = searchParams.get("region");
    const search = searchParams.get("search")?.trim() || null;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (dishName) {
      const dishType = dishNameMap[dishName];
      if (dishType) where.dishName = dishType;
    }
    if (region) where.region = region;
    if (search) {
      where.OR = [
        { town: { contains: search, mode: "insensitive" } },
        { region: { contains: search, mode: "insensitive" } },
        { foodObtained: { contains: search, mode: "insensitive" } },
      ];
    }

    const submissions = await prisma.submission.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        images: true,
        riceYamPlantainMeta: true,
        kokoMeta: true,
        bankuFufuMeta: true,
        breadMeta: true,
        gob3Meta: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.submission.count({ where });

    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (e: any) {
    console.error("Get submissions error:", e);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: e.message || "Failed to fetch submissions",
      },
      { status: 500 }
    );
  }
}

 /**
 * @swagger
 * /api/submissions:
 *   delete:
 *     summary: Delete a food submission
 *     description: Delete a food submission by ID
 *     tags: [Submissions]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the submission to delete
 *     responses:
 *       200:
 *         description: Submission deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 submission:
 *                   $ref: '#/components/schemas/Submission'
 *       400:
 *         description: Bad request - missing ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing required fields: id" }, { status: 400 });
    }
    const submission = await prisma.submission.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, submission });
  } catch (e: any) {
    console.error("Delete submission error:", e);
    return NextResponse.json({ error: "Internal server error", message: e.message || "Failed to delete submission" }, { status: 500 });
  }
}