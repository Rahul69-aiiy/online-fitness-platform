import { useEffect } from "react";
import Router from "./routes/router";
import useAuthStore from "@/store/useAuthStore";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ToastProvider from "@/components/ui/ToastProvider";

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    fetchMe();
  }, []);

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