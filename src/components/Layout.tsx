import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 p-5">
        <h1 className="text-xl font-bold text-blue-400">Quiz App</h1>

        <nav className="mt-8 space-y-4">
          <a href="/dashboard" className="block text-gray-300 hover:text-white">
            🏆 Leaderboard
          </a>
          <a href="/quiz" className="block text-gray-300 hover:text-white">
            🎯 Quiz
          </a>
          <a href="/pay" className="block text-gray-300 hover:text-white">
            💳 Payment
          </a>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-950">

        {/* ✅ TOP NAVBAR TITLE */}
        <div className="h-16 flex items-center justify-center bg-slate-900 text-white font-bold text-2xl sticky top-0 z-50">
          Sagara Sambhrama
        </div>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Layout;
