// utils/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth.ts";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
