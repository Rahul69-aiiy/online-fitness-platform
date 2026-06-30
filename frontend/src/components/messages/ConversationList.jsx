import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ConversationList({
  conversations,
  activeId,
  loading,
  search,
  onSearchChange,
  onSelect,
  hasMore,
  onLoadMore,
}) {
  const filtered = conversations.filter((c) =>
    c.otherUser?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="w-72 shrink-0 flex flex-col overflow-hidden border-border bg-card">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg mb-3">Messages</h2>
        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && conversations.length === 0 && (
          <p className="text-center py-8 text-muted-foreground text-sm">Loading...</p>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm gap-2 px-4 text-center">
            <MessageSquare className="w-8 h-8 opacity-30" />
            <p>No conversations yet. Subscribe to a trainer and start chatting!</p>
          </div>
        )}

        {filtered.map((conv) => {
          const other = conv.otherUser;
          const isActive = other?.id === activeId;

          return (
            <button
              key={other?.id}
              onClick={() => onSelect(other?.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 transition-colors text-left border-b border-border/40",
                isActive
                  ? "bg-primary/10 border-l-2 border-l-primary"
                  : "hover:bg-secondary"
              )}
            >
              <img
                src={other?.avatar || "/user.jpg"}
                alt={other?.name}
                className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm truncate">{other?.name}</span>
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

        {hasMore && (
          <button
            onClick={onLoadMore}
            className="w-full py-2 text-xs text-primary hover:underline text-center"
          >
            Load more
          </button>
        )}
      </div>
    </Card>
  );
}
