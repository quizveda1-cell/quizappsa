import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  paymentStatus: "paid" | "unpaid";
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Load user + quiz status
  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await API.get("/auth/me");
        setUser(userRes.data.user);

        const statusRes = await API.get("/quiz/status");
        setAttempted(statusRes.data.attempted);
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ✅ Payment
  const handlePayment = async () => {
    try {
      const orderRes = await API.post("/payment/create-order");
      const order = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Quiz App",
        order_id: order.id,

        handler: async (response: any) => {
          const verifyRes = await API.post("/payment/verify", response);
          setUser(verifyRes.data.user);
          alert("Payment successful ✅");
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment failed ❌");
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-xl w-[420px] text-center shadow-lg">

        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}</h1>

        {/* 🟥 UNPAID */}
        {user?.paymentStatus === "unpaid" && (
          <>
            <p className="text-gray-400 mb-6">Pay ₹49 to start the quiz</p>
            <button
              onClick={handlePayment}
              className="w-full bg-yellow-500 hover:bg-yellow-600 p-3 rounded font-bold text-black"
            >
              💳 Pay ₹49
            </button>
          </>
        )}

        {/* 🟨 PAID BUT NOT ATTEMPTED → RULES */}
        {user?.paymentStatus === "paid" && !attempted && (
          <button
            onClick={() => navigate("/rules")}
            className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-bold mt-4"
          >
            📜 View Rules & Start Quiz
          </button>
        )}

        {/* 🟩 ATTEMPTED → RESULT */}
        {attempted && (
          <button
            onClick={() => navigate("/result")}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold mt-4"
          >
            📊 View Result
          </button>
        )}

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="mt-6 text-red-400 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
