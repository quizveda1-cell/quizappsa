import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", form);

      const token = res.data.token;
      const user = res.data.user;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const paymentStatus = user?.paymentStatus?.toLowerCase();

      // ❌ Not paid → Payment page
      if (!paymentStatus || paymentStatus !== "paid") {
        navigate("/payment", { replace: true });
        return;
      }

      // ✅ CHECK QUIZ STATUS FROM BACKEND
      try {
        const statusRes = await API.get("/quiz/status");

        if (statusRes.data.completed === true) {
          // ✅ Quiz already attempted → Result page
          navigate("/result", { replace: true });
          return;
        }
      } catch (err) {
        console.error("Quiz status check failed");
      }

      // ✅ Paid + Quiz not attempted → Rules page
      navigate("/rules", { replace: true });

    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col">

      {/* 🔷 NAVBAR */}
      <div className="flex items-center px-10 py-3 bg-[#2f2a7c] shadow-lg">

        <h1
          className="text-2xl font-extrabold text-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          QUIZVEDA
        </h1>


<button
          onClick={() => navigate("/Landing")}
          className="ml-auto bg-white text-[#2f2a7c] px-5 py-1.5 rounded-full font-semibold hover:bg-yellow-300 transition"
        >
          Home
        </button>


        <button
          onClick={() => navigate("/register")}
          className="ml-auto bg-white text-[#2f2a7c] px-5 py-1.5 rounded-full font-semibold hover:bg-yellow-300 transition"
        >
          Register
        </button>
      </div>

      {/* 🏆 HEADING */}
      <div className="text-center mt-5">
        <h2 className="text-3xl font-extrabold text-[#2f2a7c] tracking-wide">
          ಸಾಗರ ಸಂಭ್ರಮ
        </h2>
        <p className="text-sm text-gray-500 mt-1">

        </p>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="flex flex-1 items-center justify-center px-12 gap-12 mt-6">

        {/* ✅ LEFT - LOGIN */}
        <div className="bg-white p-8 rounded-xl shadow-xl w-[380px]">

          <h2 className="text-xl font-bold mb-4 text-center text-[#2f2a7c]">
            Login to Continue
          </h2>

          {error && <p className="text-red-600 mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              name="identifier"
              placeholder="Email or Phone"
              required
              value={form.identifier}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2f2a7c]"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2f2a7c]"
            />

            <button className="w-full bg-[#2f2a7c] text-white py-2 rounded font-bold hover:opacity-90 transition">
              Login →
            </button>
          </form>

          <p className="text-sm mt-3 text-center">
            New user?{" "}
            <Link to="/register" className="text-[#2f2a7c] font-bold hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* ✅ RIGHT - FULL TERMS & CONDITIONS */}
        <div className="bg-white p-6 rounded-xl shadow-xl w-[550px] h-[450px] overflow-y-auto text-sm text-gray-700 leading-relaxed">

          <h2 className="text-lg font-bold mb-3 text-[#2f2a7c]">
            📜 Terms & Conditions – Quiz App
          </h2>

          <p className="mb-3">
            By registering, paying, and participating in this quiz, you confirm that you have read,
            understood, and agreed to the following Terms & Conditions. Participation is voluntary.
          </p>

          <h3 className="font-semibold mt-3">1. Eligibility</h3>
          <ul className="list-disc ml-5">
            <li>Participants must be any years or above.</li>
            <li>Participants must provide accurate and truthful information.</li>
            <li>False or misleading details may lead to disqualification without refund.</li>
          </ul>

          <h3 className="font-semibold mt-3">2. Entry Fee & Payment</h3>
          <ul className="list-disc ml-5">
            <li>The entry fee (₹49 or as displayed) is non-refundable and non-transferable.</li>
            <li>Successful payment is required to access the quiz.</li>
            <li>The platform is not responsible for payment failures or delays.</li>
          </ul>

          <h3 className="font-semibold mt-3">3. Quiz Rules</h3>
          <ul className="list-disc ml-5">
            <li>Only one attempt is allowed.</li>
            <li>The quiz is time-bound and auto-submitted when time ends.</li>
            <li>Ranking is based on correct answers and time taken.</li>
          </ul>

          <h3 className="font-semibold mt-3">4. Fair Play & Disqualification</h3>
          <ul className="list-disc ml-5">
            <li>No cheating, bots, scripts, or external help.</li>
            <li>No multiple registrations.</li>
            <li>No sharing of questions or answers.</li>
            <li>No screen recording, screenshots, or screen sharing.</li>
            <li>Violation leads to immediate disqualification without refund.</li>
          </ul>

          <h3 className="font-semibold mt-3">5. Technical Responsibility</h3>
          <ul className="list-disc ml-5">
            <li>Participants must ensure stable internet and device compatibility.</li>
            <li>The platform is not liable for technical failures.</li>
          </ul>

          <h3 className="font-semibold mt-3">6. Results & Decision</h3>
          <ul className="list-disc ml-5">
            <li>Results declared by the platform are final.</li>
            <li>No disputes or re-evaluations will be entertained.</li>
          </ul>

          <h3 className="font-semibold mt-3">7. Prizes & Payout</h3>
          <ul className="list-disc ml-5">
            <li>Prize money will be transferred via UPI/Bank.</li>
            <li>Taxes are the responsibility of winners.</li>
          </ul>

          <h3 className="font-semibold mt-3">8. Cancellation or Modification</h3>
          <ul className="list-disc ml-5">
            <li>The organizer may modify rules or cancel the quiz.</li>
          </ul>

          <h3 className="font-semibold mt-3">9. Data Usage & Privacy</h3>
          <ul className="list-disc ml-5">
            <li>Data is used only for quiz operations and prize distribution.</li>
          </ul>

          <h3 className="font-semibold mt-3">10. Limitation of Liability</h3>
          <ul className="list-disc ml-5">
            <li>The platform is not responsible for losses or damages.</li>
          </ul>

          <h3 className="font-semibold mt-3">11. Acceptance of Terms</h3>
          <ul className="list-disc ml-5">
            <li>By logging in or paying, you agree to all terms.</li>
          </ul>

          <h3 className="font-semibold mt-3">12. Jurisdiction</h3>
          <ul className="list-disc ml-5">
            <li>Governed by the laws of India.</li>
          </ul>

        </div>

      </div>
    </div>
  );
};

export default Login;
