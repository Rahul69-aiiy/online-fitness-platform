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
  activeUser: null,

  setActiveConversation: (id) => set({ activeConversationId: id }),

  fetchConversations: async (page = 1) => {
    set({ convLoading: true });
    try {
      const res = await api.get(`/messages/conversations?page=${page}&limit=20`);
      if (res.data?.success) {
        const incoming = res.data.data;
        set((s) => {
          if (page === 1) {
            // Merge incoming page 1 with existing conversations to preserve pagination
            const newConvs = [...incoming];
            const incomingIds = new Set(incoming.map((c) => c.otherUser?.id));
            for (const existingConv of s.conversations) {
              if (existingConv.otherUser?.id && !incomingIds.has(existingConv.otherUser.id)) {
                newConvs.push(existingConv);
              }
            }
            return {
              conversations: newConvs,
              convPagination: {
                ...res.data.pagination,
                page: s.convPagination.page, // Preserve current page depth
                totalPages: Math.max(s.convPagination.totalPages, res.data.pagination.totalPages)
              },
              convLoading: false,
            };
          } else {
            return {
              conversations: [...s.conversations, ...incoming],
              convPagination: res.data.pagination,
              convLoading: false,
            };
          }
        });
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
          activeUser: res.data.otherUser || s.activeUser,
          msgLoading: false,
        }));
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

  receiveNewMessage: async (message) => {
    const { activeConversationId } = get();
    const isActive =
      message.senderId === activeConversationId ||
      message.receiverId === activeConversationId;

    if (isActive) {
      set((s) => ({ messages: [...s.messages, message] }));

      // If we are actively viewing this conversation and it's an incoming message, mark it as read immediately
      if (message.senderId === activeConversationId) {
        try {
          await api.post(`/messages/read/${activeConversationId}`);
        } catch (err) {
          console.error("Failed to mark message as read:", err);
        }
      }
    }

    // Refresh conversations list to get updated lastMessage and unreadCounts
    get().fetchConversations(1);
  },

  clearMessages: () => set({ messages: [], activeUser: null, msgPagination: { page: 1, totalPages: 1, hasMore: false } }),
}));

export default useMessageStore;
