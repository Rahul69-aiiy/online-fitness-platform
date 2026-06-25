import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useReviewsQuery(trainerId) {
  return useQuery({
    queryKey: ["reviews", trainerId],
    queryFn: async () => {
      if (!trainerId) return [];
      const res = await api.get(`/reviews/trainer/${trainerId}`);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch reviews");
      }
      return res.data.data;
    },
    enabled: !!trainerId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ trainerId, rating, comment }) => {
      const res = await api.post("/reviews", { trainerId, rating, comment });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create review");
      }
      return res.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.trainerId] });
      queryClient.invalidateQueries({ queryKey: ["trainer", variables.trainerId] });
    },
  });
}

export function useUpdateReview(trainerId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, rating, comment }) => {
      const res = await api.put(`/reviews/${reviewId}`, { rating, comment });
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update review");
      }
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", trainerId] });
      queryClient.invalidateQueries({ queryKey: ["trainer", trainerId] });
    },
  });
}

export function useDeleteReview(trainerId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId) => {
      const res = await api.delete(`/reviews/${reviewId}`);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to delete review");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", trainerId] });
      queryClient.invalidateQueries({ queryKey: ["trainer", trainerId] });
    },
  });
}
