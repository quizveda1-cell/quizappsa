import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      const orderRes = await API.post("/payment/create-order");
      const { id: order_id, amount, currency } = orderRes.data;

      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay SDK failed");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount,
        currency,
        name: "QuizVeda",
        description: "Quiz Entry Fee",
        order_id,

        handler: async function (response: any) {
          try {
            const verifyRes = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            localStorage.setItem("user", JSON.stringify(verifyRes.data.user));

            alert("Payment successful 🎉");
            window.location.href = "/rules";
          } catch (err) {
            console.error(err);
            alert("Payment verification failed ❌");
          }
        },
        theme: { color: "#7c3aed" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7ff]">
      <div className="bg-white shadow-xl rounded-xl p-8 w-[380px] text-center">
        <h2 className="text-xl font-bold mb-4">Secure Payment</h2>
        <div className="mb-6 font-semibold">₹49 Entry Fee</div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {loading ? "Processing..." : "Pay via Razorpay"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
