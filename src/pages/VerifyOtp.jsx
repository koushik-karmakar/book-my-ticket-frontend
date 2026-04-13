import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, RotateCcw } from "lucide-react";
import axios from "axios";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const backend = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }
    const interval = setInterval(
      () => setTimer((t) => (t > 0 ? t - 1 : 0)),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${(s % 60).toString().padStart(2, "0")}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${backend}/api/auth/verify-otp`, { email, otp });
      toast.success("Email verified! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post(`${backend}/api/auth/resend-otp`, { email });
      toast.success("New OTP sent");
      setTimer(300);
      setOtp("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4">
      <div className="bg-[#1a1a2e] rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-[#333] text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#e94560]/10 p-3 rounded-full mb-3">
            <Mail size={28} className="text-[#e94560]" />
          </div>
          <h2 className="text-white text-2xl font-bold">Verify Email</h2>
          <p className="text-gray-400 text-sm mt-1">
            OTP sent to <span className="text-white">{email}</span>
          </p>
        </div>

        <div className="mb-6">
          <span
            className={`text-4xl font-bold ${timer === 0 ? "text-[#e94560]" : "text-green-400"}`}
          >
            {formatTime(timer)}
          </span>
          <p className="text-gray-500 text-xs mt-1">
            {timer > 0 ? "OTP expires in" : "OTP expired"}
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-3">
          <input
            className="bg-[#16213e] text-white border border-[#333] rounded-lg px-4 py-3 text-center text-xl tracking-widest outline-none focus:border-[#e94560] transition"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            disabled={timer === 0}
            required
          />
          <button
            type="submit"
            disabled={loading || timer === 0}
            className="bg-[#e94560] hover:bg-red-600 cursor-pointer text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {timer === 0 && (
          <button
            onClick={handleResend}
            disabled={resending}
            className="flex items-center justify-center gap-2 w-full mt-3 border border-[#e94560] text-[#e94560] py-3 rounded-lg hover:bg-[#e94560]/10 transition disabled:opacity-50"
          >
            <RotateCcw size={15} />
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        )}
      </div>
    </div>
  );
}
