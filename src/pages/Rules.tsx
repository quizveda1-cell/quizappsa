import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Rules = () => {
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Instant payment check from localStorage (NO API CALL)
    const userRaw = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userRaw) {
      navigate("/login", { replace: true });
      return;
    }

    let user: any = null;
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }

    if (!user || user.paymentStatus !== "paid") {
      navigate("/payment", { replace: true });
      return;
    }

    setLoading(false);
  }, [navigate]);

  const startQuiz = () => {
    if (!agree) {
      alert("⚠️ You must accept the rules before starting the quiz!");
      return;
    }

    navigate("/quiz");
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading rules...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f7ff]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[600px]">

        <h2 className="text-2xl font-bold mb-4 text-red-600">
          ⚠️ QUIZ RULES & ANTI-CHEATING POLICY
        </h2>

        <ul className="space-y-2 text-gray-700 text-sm leading-relaxed">
          <li>1. The quiz contains <b>10 questions</b>.</li>
          <li>2. Each question has a time limit of <b>20 seconds</b>.</li>
          <li>3. Each question has <b>4 options</b>, and only one correct answer.</li>
          <li>4. Once you select an option, it <b>cannot be changed</b>.</li>
          <li>5. You cannot reattempt the quiz once it is submitted.</li>
          <li>6. If you try to <b>copy</b> or take a <b>screenshot</b>, the quiz will be <b>automatically submitted</b>.</li>
        </ul>

        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mt-4 text-xs font-semibold">
          ⚠️ Any cheating attempt will result in immediate auto-submission of your quiz.
        </div>

        <div className="flex items-center mt-4 gap-2">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">
            I have read and agree to all the rules and conditions.
          </span>
        </div>

        <button
          onClick={startQuiz}
          className={`mt-6 w-full py-3 rounded-lg font-bold transition
            ${
              agree
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }
          `}
        >
          🚀 Start Quiz
        </button>
      </div>
    </div>
  );
};

export default Rules;
