import { create } from 'zustand';
import api from '@/lib/api';

const useTrainerStore = create((set) => ({
  trainers: [],
  selectedTrainer: null,
  isLoading: false,
  pagination: { page: 1, totalPages: 1, total: 0 },
  filters: { search: '', category: '', rating: '' },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),

  fetchTrainers: async (filters = {}, page = 1) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (filters.search) params.set('search', filters.search);
      if (filters.category && filters.category !== 'All') params.set('category', filters.category);
      if (filters.rating) params.set('rating', filters.rating);
      const res = await api.get(`/trainers?${params.toString()}`);
      if (res.data?.success) {
        set({
          trainers: res.data.data,
          pagination: res.data.pagination,
          isLoading: false,
        });
      }
    } catch (err) {
      console.error('fetchTrainers error:', err);
      set({ isLoading: false });
    }
  },

  fetchTrainerById: async (id) => {
    set({ isLoading: true, selectedTrainer: null });
    try {
      const res = await api.get(`/trainers/${id}`);
      if (res.data?.success) {
        set({ selectedTrainer: res.data.data, isLoading: false });
        return res.data.data;
      }
    } catch (err) {
      console.error('fetchTrainerById error:', err);
      set({ isLoading: false });
    }
    return null;
  },

  clearSelectedTrainer: () => set({ selectedTrainer: null }),
}));

export default useTrainerStore;
