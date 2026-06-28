import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

// Initiate a Razorpay order for a subscription plan
export function useCreateOrder() {
  return useMutation({
    mutationFn: async (planId) => {
      const res = await api.post("/payments/order", { planId });
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to create order");
      return res.data.data;
    },
  });
}

// Verify payment signature and activate subscription
export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/payments/verify", payload);
      if (!res.data?.success) throw new Error(res.data?.message || "Payment verification failed");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["payment-history"] });
    },
  });
}

// Full payment history for the logged-in student
export function usePaymentHistory() {
  return useQuery({
    queryKey: ["payment-history"],
    queryFn: async () => {
      const res = await api.get("/payments/history");
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch payment history");
      return res.data.data;
    },
  });
}
