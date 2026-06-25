import { create } from 'zustand';
import api from '@/lib/api';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  fetchMe: async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.success) {
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      set({ user: res.data.user, isAuthenticated: true });
    }
    return res.data;
  },

  googleLogin: async (firebaseToken) => {
    const res = await api.post('/auth/google', { firebaseToken });
    if (res.data?.success) {
      set({ user: res.data.user, isAuthenticated: true });
    }
    return res.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (updatedUser) => {
    set({ user: { ...get().user, ...updatedUser } });
  },
}));

export default useAuthStore;
