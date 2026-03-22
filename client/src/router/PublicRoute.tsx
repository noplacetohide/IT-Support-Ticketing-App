import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute: Wraps pages that should only be accessible to unauthenticated users (e.g., Login).
 * - If authenticated + profile complete → redirect to /
 * - If authenticated but no profile → redirect to /profile-setup
 * - Otherwise → render children
 */
export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isProfileComplete } = useAuth();

  if (isAuthenticated && isProfileComplete) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && !isProfileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <>{children}</>;
}
