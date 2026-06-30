import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

export default function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (isAuthenticated) {
    // Redirect authenticated users to their appropriate dashboard
    if (user?.role === "TRAINER") {
      return <Navigate to="/trainer/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
