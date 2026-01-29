import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

interface LeaderboardUser {
  name: string;
  score: number;
}

const Result = () => {
  const navigate = useNavigate();

  const [score, setScore] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  const totalQuestions = 10;

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await API.get("/quiz/status");

        // ✅ If quiz not completed → go back to rules
        if (!res.data.completed) {
          navigate("/rules");
          return;
        }

        // ✅ Set score safely
        setScore(res.data.score ?? 0);

      } catch (err) {
        console.error("Result fetch failed:", err);
        navigate("/rules");
      } finally {
        setLoading(false);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await API.get("/leaderboard");
        setLeaderboard(res.data || []);
      } catch (err) {
        console.error("Leaderboard fetch failed");
      }
    };

    fetchResult();
    fetchLeaderboard();

    // ✅ Time calculation
    const start = Number(localStorage.getItem("quizStartTime"));
    const end = Date.now();
    if (start) {
      setTimeTaken(Math.floor((end - start) / 1000));
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading Result...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col items-center pt-16">

      <div className="bg-white shadow-xl rounded-xl p-8 w-[500px] text-center">
        <div className="text-5xl mb-3">🏆</div>
        <h2 className="text-2xl font-bold mb-1">Quiz Completed!</h2>
        <p className="text-gray-500 mb-6">Your performance summary 👇</p>

        <div className="flex justify-center gap-6 mb-6">
          <div className="bg-purple-50 px-6 py-4 rounded-lg">
            <p className="text-sm text-gray-500">SCORE</p>
            <p className="text-2xl font-bold text-purple-600">
              {score}/{totalQuestions}
            </p>
          </div>

          <div className="bg-gray-50 px-6 py-4 rounded-lg">
            <p className="text-sm text-gray-500">TIME</p>
            <p className="text-2xl font-bold">{timeTaken}s</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="text-purple-600 font-semibold hover:underline"
        >
          Back to Home
        </button>
      </div>

      <div className="mt-10 w-[600px]">
        <h3 className="text-xl font-bold mb-3">🏅 Top Leaderboard</h3>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {leaderboard.map((user, index) => (
            <div key={index} className="flex justify-between px-6 py-3 border-b">
              <span className="font-semibold">
                #{index + 1} {user.name}
              </span>
              <span className="font-bold text-purple-600">
                {user.score} pts
              </span>
            </div>
          ))}

          {leaderboard.length === 0 && (
            <p className="text-center py-6 text-gray-500">
              No leaderboard data yet...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
