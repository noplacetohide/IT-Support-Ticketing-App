import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PublicRoute from "@/router/PublicRoute";
import PrivateRoute from "@/router/PrivateRoute";
import GetStarted from "@/pages/GetStarted";
import ProfileSetupPage from "@/pages/ProfileSetupPage";
import DashboardPage from "@/pages/DashboardPage";

export default function AppRouter() {
  const { isAuthenticated, isProfileComplete } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/get-started"
        element={
          <PublicRoute>
            <GetStarted />
          </PublicRoute>
        }
      />

      {/* Profile Setup — requires auth but no role check */}
      <Route
        path="/profile-setup"
        element={
          isAuthenticated ? (
            isProfileComplete ? (
              <Navigate to="/" replace />
            ) : (
              <ProfileSetupPage />
            )
          ) : (
            <Navigate to="/get-started" replace />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      {/* Default redirect */}
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated && isProfileComplete ? "/" : "/get-started"}
            replace
          />
        }
      />

      {/* Catch-all → redirect to login */}
      <Route path="*" element={<Navigate to="/get-started" replace />} />
    </Routes>
  );
}
