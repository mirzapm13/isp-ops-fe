import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/auth.store";

export function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
