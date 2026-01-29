import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Question {
  id: string;
  question: string;
  options: string[];
}

const TOTAL_TIME = 20;

const Quiz = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // ✅ Start Quiz
  useEffect(() => {
    const startQuiz = async () => {
      try {
        const res = await API.get("/quiz/start");
        setQuestions(res.data.questions);
        setLoading(false);
      } catch (err: any) {
        alert(err.response?.data?.message || "Quiz error");
        navigate("/rules");
      }
    };

    startQuiz();
  }, [navigate]);

  // ✅ Timer
  useEffect(() => {
    if (loading || submitted) return;

    if (timeLeft === 0) {
      goNext();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, loading, submitted]);

  // ✅ Anti Screenshot + Copy (ONLY what you asked)
  useEffect(() => {
    if (submitted) return;

    // Screenshot detection (PrintScreen key)
    const handleScreenshot = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        alert("❌ Screenshot detected. Quiz submitted!");
        submitQuiz();
      }

      // Ctrl + C copy
      if (e.ctrlKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        alert("❌ Copy detected. Quiz submitted!");
        submitQuiz();
      }
    };

    // Block copy event
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      alert("❌ Copy detected. Quiz submitted!");
      submitQuiz();
    };

    // Block text selection
    const handleSelect = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleScreenshot);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("selectstart", handleSelect);

    return () => {
      window.removeEventListener("keydown", handleScreenshot);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("selectstart", handleSelect);
    };
  }, [submitted]);

  // ✅ Select Answer
  const selectOption = (index: number) => {
    const qId = String(questions[current].id);
    setAnswers(prev => ({ ...prev, [qId]: index }));
  };

  // ✅ Next Question
  const goNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(prev => prev + 1);
      setTimeLeft(TOTAL_TIME);
    } else {
      submitQuiz();
    }
  };

  // ✅ Submit Quiz
  const submitQuiz = async () => {
    if (submitted) return;
    setSubmitted(true);

    try {
      const res = await API.post("/quiz/submit", { answers });
      alert(`🎉 Score: ${res.data.score}/${questions.length}`);
      navigate("/result");
    } catch (err) {
      console.error(err);
      alert("❌ Quiz submission failed");
      setSubmitted(false);
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading Quiz...</div>;
  }

  const q = questions[current];

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a] text-white select-none">
      <div className="bg-white text-black w-[650px] rounded-xl shadow-xl p-8">

        <div className="flex justify-between mb-4">
          <h2>Question {current + 1}/{questions.length}</h2>
          <div>⏱ {timeLeft}s</div>
        </div>

        <h3 className="mb-6">{q.question}</h3>

        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => selectOption(idx)}
              className={`w-full text-left px-4 py-3 rounded-lg border
                ${answers[q.id] === idx ? "bg-purple-600 text-white" : "bg-gray-100"}
              `}
            >
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          ))}
        </div>

        <button
          onClick={goNext}
          className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg"
        >
          {current + 1 === questions.length ? "Submit Quiz" : "Next Question"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
