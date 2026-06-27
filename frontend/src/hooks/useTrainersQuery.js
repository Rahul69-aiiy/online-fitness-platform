import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function useTrainersQuery(filters = {}, page = 1) {
  return useQuery({
    queryKey: ["trainers", { search: filters.search, category: filters.category, rating: filters.rating, page }],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: 12 });
      if (filters.search) params.set("search", filters.search);
      if (filters.category && filters.category !== "All") {
        params.set("category", filters.category);
      }
      if (filters.rating) {
        params.set("rating", filters.rating);
      }
      const res = await api.get(`/trainers?${params.toString()}`);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch trainers");
      }
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
}
