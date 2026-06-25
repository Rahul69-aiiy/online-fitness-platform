import { create } from 'zustand';
import api from '@/lib/api';

const useMessageStore = create((set, get) => ({
  conversations: [],
  convPagination: { page: 1, totalPages: 1 },
  convLoading: false,

  messages: [],
  msgPagination: { page: 1, totalPages: 1, hasMore: false },
  msgLoading: false,

  activeConversationId: null,

  unreadCount: 0,

  setActiveConversation: (id) => set({ activeConversationId: id }),

  fetchConversations: async (page = 1) => {
    set({ convLoading: true });
    try {
      const res = await api.get(`/messages/conversations?page=${page}&limit=20`);
      if (res.data?.success) {
        const incoming = res.data.data;
        set((s) => ({
          conversations:
            page === 1 ? incoming : [...s.conversations, ...incoming],
          convPagination: res.data.pagination,
          convLoading: false,
        }));
      }
    } catch (err) {
      console.error('fetchConversations error:', err);
      set({ convLoading: false });
    }
  },

  fetchMessages: async (otherUserId, page = 1) => {
    set({ msgLoading: true });
    try {
      const res = await api.get(
        `/messages/conversations/${otherUserId}?page=${page}&limit=30`
      );
      if (res.data?.success) {
        const incoming = res.data.data;
        set((s) => ({
          messages: page === 1 ? incoming : [...incoming, ...s.messages],
          msgPagination: res.data.pagination,
          msgLoading: false,
        }));
        // Refresh unread count after reading
        get().fetchUnreadCount();
        // Refresh conversation list to update unread badges
        get().fetchConversations(1);
      }
    } catch (err) {
      console.error('fetchMessages error:', err);
      set({ msgLoading: false });
    }
  },

  sendMessage: async (receiverId, content) => {
    try {
      const res = await api.post('/messages/send', { receiverId, content });
      if (res.data?.success) {
        set((s) => ({ messages: [...s.messages, res.data.data] }));
        // Refresh conversations to show latest message
        get().fetchConversations(1);
        return res.data.data;
      }
    } catch (err) {
      console.error('sendMessage error:', err);
      throw err;
    }
  },

  receiveNewMessage: (message) => {
    const { activeConversationId } = get();
    const isActive =
      message.senderId === activeConversationId ||
      message.receiverId === activeConversationId;
    if (isActive) {
      set((s) => ({ messages: [...s.messages, message] }));
    }
    set((s) => ({ unreadCount: s.unreadCount + 1 }));
    // Refresh conversations list
    get().fetchConversations(1);
  },

  fetchUnreadCount: async () => {
    try {
      const res = await api.get('/messages/unread-count');
      if (res.data?.success) {
        set({ unreadCount: res.data.data.unreadCount });
      }
    } catch {}
  },

  clearMessages: () => set({ messages: [], msgPagination: { page: 1, totalPages: 1, hasMore: false } }),
}));

export default useMessageStore;
