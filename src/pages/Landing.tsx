import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

interface LeaderboardUser {
  name: string;
  score: number;
}

const Landing = () => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get("/leaderboard");
        setLeaders(res.data);
      } catch (err) {
        console.error("Leaderboard error:", err);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col">

      {/* 🔷 NAVBAR */}
      <div className="flex items-center px-10 py-4 bg-[#2f2a7c] shadow-lg">

        <h1 className="text-2xl font-extrabold text-white tracking-wide">
          QUIZVEDA
        </h1>

        <button
          onClick={() => navigate("/login")}
          className="ml-auto bg-white text-[#2f2a7c] px-5 py-1.5 rounded-full font-semibold shadow-md hover:bg-[#e6e4ff] transition-all duration-300"
        >
          Login
        </button>
      </div>

      {/* 🏆 Heading below Navbar */}
      <div className="text-center mt-6">
        <h2 className="text-3xl  text-[#2f2a7c] tracking-wide">
          ಸಾಗರ ಸಂಭ್ರಮ
        </h2>
        <p className="text-sm text-gray-500 mt-1"></p>
      </div>

      {/* Main Section */}
      <div className="flex flex-1 px-10 py-16 gap-10">

        {/* Left Section */}
        <div className="w-1/2">
          <span className="bg-[#e6e4ff] text-[#2f2a7c] px-3 py-1 rounded-full text-sm font-semibold">
            ₹49 Entry Fee
          </span>

          <h1 className="text-5xl font-bold mt-6 text-gray-900">
            Master the Quiz,
            <br />
            <span className="text-[#2f2a7c]"></span>
          </h1>

          <p className="text-gray-600 mt-6 text-lg">
            Join the most competitive quiz platform. Test your knowledge across
            10 questions in 3.3 minutes.
          </p>

          <ul className="mt-6 space-y-3 text-gray-700">
            <li>✅ Anti-cheating system integrated</li>
            <li>✅ Instant automated evaluation</li>
            <li>✅ Top 3 participants win cash prizes</li>
            <li>✅ Fair competition for all</li>
          </ul>

          <button
            onClick={() => navigate("/register")}
            className="mt-8 bg-[#2f2a7c] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90"
          >
            Register Now →
          </button>
        </div>

        {/* Right Section - Leaderboard */}
        <div className="w-1/2 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-[#2f2a7c]">
            🏆 Live Leaderboard
          </h2>

          {leaders.length === 0 ? (
            <p className="text-gray-500">No data yet...</p>
          ) : (
            <div className="space-y-3">
              {leaders.map((user, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-[#f3f2ff] px-4 py-2 rounded-lg"
                >
                  <span className="font-semibold">
                    {index + 1}. {user.name}
                  </span>
                  <span className="text-[#2f2a7c] font-bold">
                    {user.score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prize Bar */}
      <div className="bg-[#2f2a7c] text-white py-4 flex justify-around font-semibold">
        <span>🥇 1st Prize: ₹7,000</span>
        <span>🥈 2nd Prize: ₹4,000</span>
        <span>🥉 3rd Prize: ₹2,000</span>
      </div>
    </div>
  );
};

export default Landing;
