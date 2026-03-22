import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/auth";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * PrivateRoute: Wraps pages that require authentication.
 * - If not authenticated → redirect to /get-started
 * - If authenticated but no profile (and not on profile-setup) → redirect to /profile-setup
 * - If allowedRoles specified and user's role not included → redirect to /
 * - Otherwise → render children
 */
export default function PrivateRoute({
  children,
  allowedRoles,
}: PrivateRouteProps) {
  const { isAuthenticated, isProfileComplete, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/get-started" replace />;
  }

  if (!isProfileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user?.role || 'ADMIN')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
