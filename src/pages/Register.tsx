import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    location: "",
    email: "",
    phone: "",
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
      const res = await API.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/login");
    } catch (err: any) {
      console.log("REGISTER ERROR:", err.response?.data);
      setError(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col">

      {/* 🔷 NAVBAR (same theme color) */}
      <div className="flex items-center px-10 py-4 bg-[#2f2a7c] shadow-lg">

        <h1
          className="text-2xl font-extrabold text-white tracking-wide cursor-pointer"
          onClick={() => navigate("/")}
        >
          QUIZVEDA
        </h1>


 <button
          onClick={() => navigate("/Landing")}
          className="ml-auto bg-white text-[#2f2a7c] px-5 py-1.5 rounded-full font-semibold shadow-md hover:bg-[#e6e4ff] transition-all duration-300"
        >
          Home
        </button>


        <button
          onClick={() => navigate("/login")}
          className="ml-auto bg-white text-[#2f2a7c] px-5 py-1.5 rounded-full font-semibold shadow-md hover:bg-[#e6e4ff] transition-all duration-300"
        >
          Login
        </button>
      </div>

      {/* 🏆 SAGARA SAMBRAMA BELOW NAVBAR */}
      <div className="text-center mt-6">
        <h2 className="text-3xl font-extrabold text-[#2f2a7c] tracking-wide">
          ಸಾಗರ ಸಂಭ್ರಮ
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          National Level Quiz Competition
        </p>
      </div>

      {/* Register Card */}
      <div className="flex flex-1 items-center justify-center mt-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-[420px]">

          <h2 className="text-xl font-bold mb-4 text-center text-[#2f2a7c]">
            Registration Details
          </h2>

          {error && <p className="text-red-600 mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              name="name"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2f2a7c]"
            />

            <div className="flex gap-2">
              <input
                name="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-1/2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2f2a7c]"
              />

              <input
                name="phone"
                placeholder="Phone"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-1/2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2f2a7c]"
              />
            </div>

            <div className="flex gap-2">
              <input
                name="age"
                placeholder="Age"
                required
                value={form.age}
                onChange={handleChange}
                className="w-1/2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2f2a7c]"
              />

              <input
                name="location"
                placeholder="City"
                required
                value={form.location}
                onChange={handleChange}
                className="w-1/2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2f2a7c]"
              />
            </div>

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
              Register Now →
            </button>
          </form>

          <p className="text-sm mt-3 text-center">
            Already registered?{" "}
            <Link to="/login" className="text-[#2f2a7c] font-bold hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
