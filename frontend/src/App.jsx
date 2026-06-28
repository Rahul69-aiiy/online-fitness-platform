import { useEffect } from "react";
import Router from "./routes/router";
import useAuthStore from "@/store/useAuthStore";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ToastProvider from "@/components/ui/ToastProvider";
import { connectSocket, disconnectSocket } from "@/lib/socket";

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const isLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchMe();
  }, []);

  // Connect socket when authenticated, disconnect when logged out
  useEffect(() => {
    if (user?.id) {
      connectSocket(user.id);
    } else {
      disconnectSocket();
    }
  }, [user?.id]);

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