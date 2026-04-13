import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const backend = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${backend}/api/auth/login`, form);
      console.log("backnd", backend);
      const { access_token, refresh_token, user } = res.data.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      setUser(user);
      toast.success(`Welcome back, ${user.full_name}!`);
      navigate("/movies");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4">
      <div className="bg-[#1a1a2e] rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-[#333]">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#e94560]/10 p-3 rounded-full mb-3">
            <LogIn size={28} className="text-[#e94560]" />
          </div>
          <h2 className="text-white text-2xl font-bold">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-1">Login to book your seats</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="bg-[#16213e] text-white border border-[#333] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#e94560] transition"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="bg-[#16213e] text-white border border-[#333] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#e94560] transition"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#e94560] hover:bg-red-600 text-white cursor-pointer font-semibold py-3 rounded-lg mt-2 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          No account?{" "}
          <Link to="/register" className="text-[#e94560] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
