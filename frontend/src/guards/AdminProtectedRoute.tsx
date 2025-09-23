// utils/AdminProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { getAdminStatus } from "../utils/auth.ts";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  if (!getAdminStatus()) {
    // Leite Nicht-Admins zur Dashboard-Seite oder zur Login-Seite um
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default AdminProtectedRoute;
