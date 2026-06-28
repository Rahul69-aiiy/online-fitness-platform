import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, MessageSquare, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore";
import useMessageStore from "@/store/useMessageStore";
import useToastStore from "@/store/useToastStore";
import { getSocket } from "@/lib/socket";

export default function Messages({ role = "student" }) {
  const [searchParams] = useSearchParams();
  const toId = searchParams.get("to");

  const user = useAuthStore((s) => s.user);
  const {
    conversations,
    convLoading,
    convPagination,
    messages,
    msgLoading,
    msgPagination,
    activeConversationId,
    fetchConversations,
    fetchMessages,
    sendMessage,
    receiveNewMessage,
    setActiveConversation,
    clearMessages,
  } = useMessageStore();

  const toast = useToastStore((s) => s.toast);

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [searchConv, setSearchConv] = useState("");
  const bottomRef = useRef(null);

  // Listen for socket messages on mount
  useEffect(() => {
    if (user?.id) {
      const socket = getSocket();
      socket.on("newMessage", receiveNewMessage);
      return () => socket.off("newMessage", receiveNewMessage);
    }
  }, [user?.id]);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations(1);
  }, []);

  // If navigated with ?to=userId, auto-select that conversation
  useEffect(() => {
    if (toId && toId !== activeConversationId) {
      setActiveConversation(toId);
      clearMessages();
      fetchMessages(toId, 1);
    }
  }, [toId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = (otherId) => {
    if (otherId === activeConversationId) return;
    setActiveConversation(otherId);
    clearMessages();
    fetchMessages(otherId, 1);
  };

  const handleSend = async () => {
    if (!text.trim() || !activeConversationId) return;
    setSending(true);
    try {
      await sendMessage(activeConversationId, text.trim());
      setText("");
    } catch (err) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const loadMoreMessages = () => {
    if (msgPagination.hasMore && activeConversationId) {
      fetchMessages(activeConversationId, msgPagination.page + 1);
    }
  };

  const loadMoreConversations = () => {
    if (convPagination.page < convPagination.totalPages) {
      fetchConversations(convPagination.page + 1);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.otherUser?.name?.toLowerCase().includes(searchConv.toLowerCase())
  );

  const activeUser = conversations.find(
    (c) => c.otherUser?.id === activeConversationId
  )?.otherUser;

  return (
    <DashboardLayout role={role}>
      <div className="h-[calc(100vh-5rem)] flex gap-4">
        {/* Conversation List Sidebar */}
        <Card className="w-72 shrink-0 flex flex-col overflow-hidden border-border bg-card">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-lg mb-3">Messages</h2>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchConv}
              onChange={(e) => setSearchConv(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {convLoading && conversations.length === 0 && (
              <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
                Loading...
              </div>
            )}

            {!convLoading && filteredConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm gap-2 px-4 text-center">
                <MessageSquare className="w-8 h-8 opacity-30" />
                <p>No conversations yet. Subscribe to a trainer and start chatting!</p>
              </div>
            )}

            {filteredConversations.map((conv) => {
              const other = conv.otherUser;
              const isActive = other?.id === activeConversationId;
              return (
                <button
                  key={other?.id}
                  onClick={() => handleSelectConversation(other?.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-b border-border/40",
                    isActive
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : "hover:bg-secondary"
                  )}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-border shrink-0">
                    <img
                      src={other?.avatar || "/user.jpg"}
                      alt={other?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm truncate">
                        {other?.name}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="ml-1 min-w-[18px] h-[18px] bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                          {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conv.lastMessage?.content}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Load more conversations */}
            {convPagination.page < convPagination.totalPages && (
              <button
                onClick={loadMoreConversations}
                className="w-full py-2 text-xs text-primary hover:underline text-center"
              >
                Load more
              </button>
            )}
          </div>
        </Card>

        {/* Message Thread */}
        <Card className="flex-1 flex flex-col overflow-hidden border-border bg-card">
          {!activeConversationId ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <MessageSquare className="w-16 h-16 opacity-20" />
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-border">
                  <img
                    src={activeUser?.avatar || "/user.jpg"}
                    alt={activeUser?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-sm">{activeUser?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {activeUser?.role?.toLowerCase()}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {/* Load more old messages */}
                {msgPagination.hasMore && (
                  <div className="flex justify-center mb-2">
                    <button
                      onClick={loadMoreMessages}
                      disabled={msgLoading}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ChevronUp className="w-3 h-3" />
                      {msgLoading ? "Loading..." : "Load earlier messages"}
                    </button>
                  </div>
                )}

                {messages.map((msg) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2",
                        isMine ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isMine && (
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-border shrink-0">
                          <img
                            src={msg.sender?.avatar || "/user.jpg"}
                            alt={msg.sender?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm",
                          isMine
                            ? "bg-primary text-white rounded-br-sm"
                            : "bg-secondary text-foreground rounded-bl-sm"
                        )}
                      >
                        <p>{msg.content}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            isMine ? "text-white/60 text-right" : "text-muted-foreground"
                          )}
                        >
                          {new Date(msg.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {messages.length === 0 && !msgLoading && (
                  <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                    No messages yet. Say hello! 👋
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border flex gap-2">
                <textarea
                  rows={1}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message… (Enter to send)"
                  className="flex-1 resize-none px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
                <Button
                  onClick={handleSend}
                  disabled={!text.trim() || sending}
                  size="icon"
                  className="shrink-0 h-10 w-10 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
