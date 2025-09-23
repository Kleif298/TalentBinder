import type { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import type { NavigateFunction } from "react-router-dom";

interface MyTokenPayload extends JwtPayload {
  user_id: number;
  user_email: string;
  is_admin: boolean;
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getDecodedToken(): MyTokenPayload | null {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode<MyTokenPayload>(token);
  } catch (error) {
    console.error("Ungültiger Token:", error);
    return null;
  }
}

export function handleAuthResponse(data: any, navigate: NavigateFunction) {
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  const isAdmin = getAdminStatus();
  if (isAdmin) {
    navigate("/dashboard/admin");
  } else {
    navigate("/dashboard");
  }
}

export function getAdminStatus(): boolean {
  const payload = getDecodedToken();
  return payload?.is_admin === true;
}

export function getUserId(): number | null {
  const payload = getDecodedToken();
  return payload?.user_id || null;
}

export function getUserEmail(): string | null {
  const payload = getDecodedToken();
  return payload?.user_email || null;
}
