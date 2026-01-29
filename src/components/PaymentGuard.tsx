import { Navigate } from "react-router-dom";
import type { ReactNode } from "react"; // ✅ type-only import

interface PaymentGuardProps {
  children: ReactNode; // ✅ use ReactNode instead of JSX.Element
}

const PaymentGuard = ({ children }: PaymentGuardProps) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/login" />;
  if (user.paymentStatus !== "paid") return <Navigate to="/pay" />;

  return <>{children}</>; // wrap children in fragment
};

export default PaymentGuard;




