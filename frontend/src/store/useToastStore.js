import { create } from "zustand";

const useToastStore = create((set, get) => {
  const addToast = (message, type = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, duration };
    
    set((s) => ({ toasts: [...s.toasts, newToast] }));

    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  };

  return {
    toasts: [],
    addToast,
    removeToast: (id) =>
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    toast: {
      success: (msg, dur) => addToast(msg, "success", dur),
      error: (msg, dur) => addToast(msg, "error", dur),
      info: (msg, dur) => addToast(msg, "info", dur),
    },
  };
});

export default useToastStore;
