import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

// STUDENT: Subscriptions 

export function useMySubscriptions(options = {}) {
  return useQuery({
    queryKey: ["my-subscriptions"],
    queryFn: async () => {
      const res = await api.get("/subscriptions/my");
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch subscriptions");
      return res.data.data;
    },
    ...options
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subscriptionId) => {
      const res = await api.delete(`/subscriptions/${subscriptionId}`);
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to cancel subscription");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-subscriptions"] });
    },
  });
}

// STUDENT: Payment 

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (planId) => {
      const res = await api.post("/subscriptions/order", { planId });
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to create order");
      return res.data.data;
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/subscriptions/verify", payload);
      if (!res.data?.success) throw new Error(res.data?.message || "Payment verification failed");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["payment-history"] });
    },
  });
}

export function usePaymentHistory() {
  return useQuery({
    queryKey: ["payment-history"],
    queryFn: async () => {
      const res = await api.get("/subscriptions/payments");
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch payment history");
      return res.data.data;
    },
  });
}

// TRAINER: Plans 

export function useMyPlans() {
  return useQuery({
    queryKey: ["my-plans"],
    queryFn: async () => {
      const res = await api.get("/subscriptions/plans/my");
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch plans");
      return res.data.data;
    },
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/subscriptions/plans", data);
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to create plan");
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-plans"] });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ planId, ...data }) => {
      const res = await api.put(`/subscriptions/plans/${planId}`, data);
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to update plan");
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-plans"] });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (planId) => {
      const res = await api.delete(`/subscriptions/plans/${planId}`);
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to delete plan");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-plans"] });
    },
  });
}

// TRAINER: Subscribers 

export function useMySubscribers() {
  return useQuery({
    queryKey: ["my-subscribers"],
    queryFn: async () => {
      const res = await api.get("/subscriptions/subscribers");
      if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch subscribers");
      return res.data.data;
    },
  });
}
