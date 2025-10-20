// utils/AdminProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { getAdminStatus, getUserEmail } from "../utils/auth.ts";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  console.log("User Email:", getUserEmail()); // Debugging line
  if (!getAdminStatus()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default AdminProtectedRoute;
