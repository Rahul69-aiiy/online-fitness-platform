import { create } from 'zustand';
import api from '@/lib/api';

const useReviewStore = create((set) => ({
  reviews: [],
  isLoading: false,

  fetchReviews: async (trainerId) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/reviews/trainer/${trainerId}`);
      if (res.data?.success) {
        set({ reviews: res.data.data, isLoading: false });
      }
    } catch (err) {
      console.error('fetchReviews error:', err);
      set({ isLoading: false });
    }
  },

  createReview: async ({ trainerId, rating, comment }) => {
    const res = await api.post('/reviews', { trainerId, rating, comment });
    if (res.data?.success) {
      set((s) => ({ reviews: [res.data.data, ...s.reviews] }));
      return res.data.data;
    }
    return null;
  },

  updateReview: async (reviewId, { rating, comment }) => {
    const res = await api.put(`/reviews/${reviewId}`, { rating, comment });
    if (res.data?.success) {
      set((s) => ({
        reviews: s.reviews.map((r) => (r.id === reviewId ? res.data.data : r)),
      }));
      return res.data.data;
    }
    return null;
  },

  deleteReview: async (reviewId) => {
    await api.delete(`/reviews/${reviewId}`);
    set((s) => ({ reviews: s.reviews.filter((r) => r.id !== reviewId) }));
  },
}));

export default useReviewStore;
