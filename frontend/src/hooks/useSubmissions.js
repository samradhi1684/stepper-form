import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchFormConfig,
  fetchSubmissions,
  fetchSubmission,
  createSubmission,
  updateSubmission,
  submitSubmission,
} from '../api/submissions';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  formConfig: ['formConfig'],
  submissions: ['submissions'],
  submission: (id) => ['submissions', id],
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useFormConfig = () =>
  useQuery({
    queryKey: QUERY_KEYS.formConfig,
    queryFn: fetchFormConfig,
    staleTime: Infinity, // Config rarely changes
  });

export const useSubmissions = () =>
  useQuery({
    queryKey: QUERY_KEYS.submissions,
    queryFn: fetchSubmissions,
  });

export const useSubmission = (id) =>
  useQuery({
    queryKey: QUERY_KEYS.submission(id),
    queryFn: () => fetchSubmission(id),
    enabled: Boolean(id),
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.submissions });
    },
  });
};

export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSubmission,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.submission(data._id), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.submissions });
    },
  });
};

export const useSubmitSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitSubmission,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.submission(data._id), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.submissions });
    },
  });
};
