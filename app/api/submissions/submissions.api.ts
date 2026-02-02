const BASE_URL = "/api/submissions";

// Submission types based on the route.ts SubmissionRequest
export interface ImageFile {
  url: string;
  filename: string;
  size?: number;
  mimeType?: string;
}

export interface SubmissionRequest {
  // Form2: Basic dish information
  dishName: string;
  noPersonInImage: boolean;
  mainImages?: ImageFile[];
  additionalImages?: ImageFile[];

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
}

export interface SubmissionResponse {
  success: boolean;
  submission: any;
  message?: string;
}

export interface SubmissionsListResponse {
  success: boolean;
  data: any[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface GetSubmissionsParams {
  search?: string;
  dishName?: string;
  region?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get all submissions with optional filtering and pagination
 */
export async function getSubmissions(params?: GetSubmissionsParams): Promise<SubmissionsListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append("search", params.search);
  if (params?.dishName) queryParams.append("dishName", params.dishName);
  if (params?.region) queryParams.append("region", params.region);
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.offset) queryParams.append("offset", params.offset.toString());

  const url = queryParams.toString() 
    ? `${BASE_URL}?${queryParams.toString()}` 
    : BASE_URL;

  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to get submissions" }));
    throw new Error(error.error || "Failed to get submissions");
  }
  
  return response.json();
}

/**
 * Get a single submission by ID (GET /api/submissions/[id])
 */
export async function getSubmissionById(id: number): Promise<SubmissionResponse> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to get submission" }));
    throw new Error(error.error || "Failed to get submission");
  }

  return response.json();
}

/**
 * Create a new submission
 */
export async function createSubmission(submission: SubmissionRequest): Promise<SubmissionResponse> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(submission),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to create submission" }));
    throw new Error(error.error || error.message || "Failed to create submission");
  }

  return response.json();
}

/**
 * Delete a submission by ID
 */
export async function deleteSubmission(id: number): Promise<SubmissionResponse> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to delete submission" }));
    throw new Error(error.error || error.message || "Failed to delete submission");
  }

  return response.json();
}
