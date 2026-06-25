import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function useTrainerDetailQuery(id) {
  return useQuery({
    queryKey: ["trainer", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/trainers/${id}`);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch trainer details");
      }
      return res.data.data;
    },
    enabled: !!id,
  });
}
