const BASE_URL = "/api/dashboard/data";

export interface DashboardTotals {
  users: number;
  submissions: number;
  images: number;
}

export interface DashboardDataResponse {
  totals: DashboardTotals;
}

export interface DashboardErrorResponse {
  error: string;
}

export async function getDashboardData(): Promise<
  DashboardDataResponse | DashboardErrorResponse
> {
  const response = await fetch(BASE_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      (data as DashboardErrorResponse).error || "Failed to fetch dashboard data"
    );
  }

  return data as DashboardDataResponse;
}
