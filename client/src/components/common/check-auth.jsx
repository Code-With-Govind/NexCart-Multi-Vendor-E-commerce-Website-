import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Root redirect
  if (location.pathname === "/") {
    if (!isAuthenticated) return <Navigate to="/auth/login" />;
    if (user?.role === "admin") return <Navigate to="/admin/dashboard" />;
    if (user?.role === "seller") return <Navigate to="/seller/dashboard" />;
    return <Navigate to="/shop/home" />;
  }

  // Allow public seller registration page
  if (location.pathname === "/auth/register-seller") return <>{children}</>;

  // Redirect unauthenticated users to login (except auth pages)
  if (!isAuthenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth/login" />;
  }

  // Redirect authenticated users away from login/register
  if (isAuthenticated && location.pathname.includes("/auth")) {
    if (user?.role === "admin") return <Navigate to="/admin/dashboard" />;
    if (user?.role === "seller") return <Navigate to="/seller/dashboard" />;
    return <Navigate to="/shop/home" />;
  }

  // Only admin can access /admin
  if (isAuthenticated && user?.role !== "admin" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/unauth-page" />;
  }

  // Only seller can access /seller
  if (isAuthenticated && user?.role !== "seller" && location.pathname.startsWith("/seller")) {
    return <Navigate to="/unauth-page" />;
  }

  // Admin & seller can't access shop
  if (isAuthenticated && user?.role === "admin" && location.pathname.startsWith("/shop")) {
    return <Navigate to="/admin/dashboard" />;
  }
  if (isAuthenticated && user?.role === "seller" && location.pathname.startsWith("/shop")) {
    return <Navigate to="/seller/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
