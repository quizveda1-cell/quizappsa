import { Navigate } from "react-router-dom";
import type { ReactNode } from "react"; // ✅ type-only import

interface ProtectedRouteProps {
  children: ReactNode; // ✅ use ReactNode instead of JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  console.log("ProtectedRoute token:", token);

  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; // ✅ wrap in fragment
};

export default ProtectedRoute;
