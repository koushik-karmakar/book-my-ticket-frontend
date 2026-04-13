import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    const backend = import.meta.env.VITE_API_URL;
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${backend}/api/auth/register`, form);
      toast.success("OTP sent to your email");
      navigate("/verify", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4">
      <div className="bg-[#1a1a2e] rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-[#333]">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#e94560]/10 p-3 rounded-full mb-3">
            <UserPlus size={28} className="text-[#e94560]" />
          </div>
          <h2 className="text-white text-2xl font-bold">Create Account</h2>
          <p className="text-gray-400 text-sm mt-1">
            Join us to book your seats
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="bg-[#16213e] text-white border border-[#333] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#e94560] transition"
            name="full_name"
            placeholder="First Name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
          <input
            className="bg-[#16213e] text-white border border-[#333] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#e94560] transition"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
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
            placeholder="Password (min 6)"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#e94560] hover:bg-red-600 text-white cursor-pointer font-semibold py-3 rounded-lg mt-2 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#e94560] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
