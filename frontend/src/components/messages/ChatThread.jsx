import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

function MessageBubble({ msg, isMine }) {
  return (
    <div className={cn("flex items-end gap-2", isMine ? "justify-end" : "justify-start")}>
      {!isMine && (
        <img
          src={msg.sender?.avatar || "/user.jpg"}
          alt={msg.sender?.name}
          className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
        />
      )}
      <div
        className={cn(
          "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm",
          isMine ? "bg-primary text-white rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"
        )}
      >
        <p>{msg.content}</p>
        <p className={cn("text-[10px] mt-1", isMine ? "text-white/60 text-right" : "text-muted-foreground")}>
          {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

export default function ChatThread({
  activeConversationId,
  activeUser,
  messages,
  msgLoading,
  hasMore,
  currentUserId,
  text,
  sending,
  onTextChange,
  onSend,
  onKeyDown,
}) {
  const scrollRef = useRef(null);
  const observerRef = useRef(null);
  const prevHeightRef = useRef(0);
  const loadingMoreRef = useRef(false);

  // Scroll management: preserve position on pagination, scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (loadingMoreRef.current) {
      el.scrollTop = el.scrollHeight - prevHeightRef.current;
      loadingMoreRef.current = false;
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  // Infinite scroll observer for loading older messages
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !msgLoading) {
          loadingMoreRef.current = true;
          if (scrollRef.current) {
            prevHeightRef.current = scrollRef.current.scrollHeight;
          }
          // Dispatch a custom event that the parent can listen to
          window.dispatchEvent(new CustomEvent("load-more-messages"));
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, msgLoading]);

  if (!activeConversationId) {
    return <div className="flex-1" />;
  }

  if (!activeUser) {
    return (
      <Card className="flex-1 flex flex-col items-center justify-center overflow-hidden border-border bg-card">
        <span className="text-xs text-muted-foreground">Loading chat details...</span>
      </Card>
    );
  }

  return (
    <Card className="flex-1 flex flex-col overflow-hidden border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <img
          src={activeUser.avatar || "/user.jpg"}
          alt={activeUser.name}
          className="w-9 h-9 rounded-full object-cover border border-border"
        />
        <div>
          <p className="font-bold text-sm">{activeUser.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{activeUser.role?.toLowerCase()}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {hasMore && (
          <div ref={observerRef} className="h-4 w-full flex justify-center items-center">
            {msgLoading && <span className="text-xs text-muted-foreground">Loading...</span>}
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} isMine={msg.senderId === currentUserId} />
        ))}

        {messages.length === 0 && !msgLoading && (
          <p className="text-center py-8 text-muted-foreground text-sm">No messages yet. Say hello!</p>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border flex gap-2">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message… (Enter to send)"
          className="flex-1 resize-none px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm"
        />
        <Button
          onClick={onSend}
          disabled={!text.trim() || sending}
          size="icon"
          className="shrink-0 h-10 w-10 rounded-xl"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
