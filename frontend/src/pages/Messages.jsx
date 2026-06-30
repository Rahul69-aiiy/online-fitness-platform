import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ConversationList from "@/components/messages/ConversationList";
import ChatThread from "@/components/messages/ChatThread";
import useAuthStore from "@/store/useAuthStore";
import useMessageStore from "@/store/useMessageStore";
import useToastStore from "@/store/useToastStore";
import { getSocket } from "@/lib/socket";

export default function Messages({ role = "student" }) {
  const [searchParams] = useSearchParams();
  const toId = searchParams.get("to");

  const user = useAuthStore((s) => s.user);
  const store = useMessageStore();
  const toast = useToastStore((s) => s.toast);

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [searchConv, setSearchConv] = useState("");

  const activeUser = store.activeUser || store.conversations.find(
    (c) => c.otherUser?.id === store.activeConversationId
  )?.otherUser;

  // Socket listener
  useEffect(() => {
    if (!user?.id) return;
    const socket = getSocket();
    socket.on("newMessage", store.receiveNewMessage);
    return () => socket.off("newMessage", store.receiveNewMessage);
  }, [user?.id]);

  // Load conversations on mount
  useEffect(() => { store.fetchConversations(1); }, []);

  // Auto-select conversation from ?to= param
  useEffect(() => {
    if (toId && toId !== store.activeConversationId) {
      store.setActiveConversation(toId);
      store.clearMessages();
      store.fetchMessages(toId, 1);
    }
  }, [toId]);

  // Listen for "load more" events from ChatThread's IntersectionObserver
  useEffect(() => {
    const handler = () => {
      if (store.msgPagination.hasMore && store.activeConversationId && !store.msgLoading) {
        store.fetchMessages(store.activeConversationId, store.msgPagination.page + 1);
      }
    };
    window.addEventListener("load-more-messages", handler);
    return () => window.removeEventListener("load-more-messages", handler);
  }, [store.msgPagination, store.activeConversationId, store.msgLoading]);

  const handleSelectConversation = useCallback((otherId) => {
    if (otherId === store.activeConversationId) return;
    store.setActiveConversation(otherId);
    store.clearMessages();
    store.fetchMessages(otherId, 1);
  }, [store.activeConversationId]);

  const handleSend = useCallback(async () => {
    if (!text.trim() || !store.activeConversationId) return;
    setSending(true);
    try {
      await store.sendMessage(store.activeConversationId, text.trim());
      setText("");
    } catch (err) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  }, [text, store.activeConversationId]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <DashboardLayout role={role}>
      <div className="h-[calc(100vh-5rem)] flex gap-4">
        <ConversationList
          conversations={store.conversations}
          activeId={store.activeConversationId}
          loading={store.convLoading}
          search={searchConv}
          onSearchChange={setSearchConv}
          onSelect={handleSelectConversation}
          hasMore={store.convPagination.page < store.convPagination.totalPages}
          onLoadMore={() => store.fetchConversations(store.convPagination.page + 1)}
        />

        <ChatThread
          activeConversationId={store.activeConversationId}
          activeUser={activeUser}
          messages={store.messages}
          msgLoading={store.msgLoading}
          hasMore={store.msgPagination.hasMore}
          currentUserId={user?.id}
          text={text}
          sending={sending}
          onTextChange={setText}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
        />
      </div>
    </DashboardLayout>
  );
}
