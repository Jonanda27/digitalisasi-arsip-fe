import { Navigate, Outlet } from "react-router-dom";
import { getRole, getToken } from "./auth";

export default function RequireRole({ allow = [] }) {
  const token = getToken();
  const role = getRole();

  if (!token) return <Navigate to="/login" replace />;
  if (!allow.includes(role)) return <Navigate to="/login" replace />;
  return <Outlet />;
}
