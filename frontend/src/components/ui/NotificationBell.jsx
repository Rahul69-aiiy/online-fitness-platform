import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useMessageStore from "@/store/useMessageStore";
import useAuthStore from "@/store/useAuthStore";
import { getSocket, connectSocket } from "@/lib/socket";
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const user = useAuthStore((s) => s.user);
  const {
    conversations,
    unreadCount,
    fetchConversations,
    fetchUnreadCount,
    receiveNewMessage,
  } = useMessageStore();

  // Connect socket & listen for new messages
  useEffect(() => {
    if (user?.id) {
      connectSocket(user.id);
      const socket = getSocket();
      socket.on("newMessage", receiveNewMessage);
      return () => socket.off("newMessage", receiveNewMessage);
    }
  }, [user?.id]);

  // Initial load + polling every 30s
  useEffect(() => {
    fetchConversations(1);
    fetchUnreadCount();
    const timer = setInterval(fetchUnreadCount, 30_000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount);

  // Show up to 5 most recent conversations in dropdown
  const previewConvs = conversations.slice(0, 5);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen((p) => !p)}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold px-0.5 leading-none">
            {badgeLabel}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-bold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Message previews — scrollable */}
          <div className="overflow-y-auto max-h-72">
            {previewConvs.length === 0 && (
              <div className="flex flex-col items-center justify-center h-24 text-muted-foreground text-sm gap-2">
                <MessageSquare className="w-6 h-6 opacity-30" />
                <p>No messages yet</p>
              </div>
            )}

            {previewConvs.map((conv) => {
              const other = conv.otherUser;
              const hasUnread = conv.unreadCount > 0;
              return (
                <Link
                  key={other?.id}
                  to={`/messages?to=${other?.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 hover:bg-secondary transition-colors border-b border-border/40 last:border-0",
                    hasUnread && "bg-primary/5"
                  )}
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-border shrink-0 mt-0.5">
                    <img
                      src={other?.avatar || "/user.jpg"}
                      alt={other?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={cn(
                          "text-sm truncate",
                          hasUnread ? "font-bold" : "font-medium"
                        )}
                      >
                        {other?.name}
                      </span>
                      {hasUnread && (
                        <span className="min-w-[18px] h-[18px] bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold shrink-0">
                          {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conv.lastMessage?.content}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(conv.lastMessage?.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border">
            <Link
              to="/messages"
              onClick={() => setOpen(false)}
              className="block w-full text-center text-sm text-primary font-medium hover:underline py-1"
            >
              View All Messages →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
