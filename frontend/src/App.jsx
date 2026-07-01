import { useEffect } from "react";
import Router from "./routes/router";
import useAuthStore from "@/store/useAuthStore";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ToastProvider from "@/components/ui/ToastProvider";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import useMessageStore from "@/store/useMessageStore";

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const isLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    queryClient.clear();

    useMessageStore.setState({
      conversations: [],
      messages: [],
      activeConversationId: null,
      activeUser: null,
      convPagination: { page: 1, totalPages: 1 },
      msgPagination: { page: 1, totalPages: 1, hasMore: false },
    });

    //cleanup
    disconnectSocket();

    if (user?.id) {
      connectSocket(user.id);
    }
  }, [user?.id, queryClient]);

  if (isLoading) {
    return <LoadingScreen message="Initializing your fitness space..." />;
  }

  return (
    <div>
      <Router />
      <ToastProvider />
    </div>
  );
}