import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/app/api/dashboard/data/dashboard.api";

const DASHBOARD_QUERY_KEY = "dashboard";

export function useGetDashboardDataQuery() {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY],
    queryFn: getDashboardData,
  });
}
