import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubmissions,
  getSubmissionById,
  createSubmission,
  deleteSubmission,
  type GetSubmissionsParams,
  type SubmissionRequest,
} from "@/app/api/submissions/submissions.api";

const SUBMISSIONS_QUERY_KEY = "submissions";

export function useGetSubmissionsQuery(params?: GetSubmissionsParams) {
  return useQuery({
    queryKey: [SUBMISSIONS_QUERY_KEY, params],
    queryFn: () => getSubmissions(params),
  });
}

export function useGetSubmissionByIdQuery(id: number) {
  return useQuery({
    queryKey: [SUBMISSIONS_QUERY_KEY, id],
    queryFn: () => getSubmissionById(id),
    enabled: !!id,
  });
}

export function useCreateSubmissionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (submission: SubmissionRequest) => createSubmission(submission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBMISSIONS_QUERY_KEY] });
    },
  });
}

export function useDeleteSubmissionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBMISSIONS_QUERY_KEY] });
    },
  });
}
