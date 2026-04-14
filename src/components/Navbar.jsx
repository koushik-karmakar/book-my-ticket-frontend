import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Film, Ticket, LogOut } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {
        refresh_token: localStorage.getItem("refresh_token"),
      });
    } catch {}
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <nav className="bg-[#1a1a2e] border-b border-[#333] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div
        onClick={() => navigate("/movies")}
        className="flex items-center gap-2 text-[#e94560] font-bold text-xl cursor-pointer"
      >
        <Film size={22} />
        <span>BookMyTicket</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm hidden sm:block">
          {user?.full_name}
        </span>
        <button
          onClick={() => navigate("/my-bookings")}
          className="flex items-center cursor-pointer gap-1 text-sm text-white border border-[#333] px-3 py-2 rounded-lg hover:border-[#e94560] transition"
        >
          <Ticket size={15} />
          <span className="hidden sm:block">My Bookings</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center cursor-pointer gap-1 text-sm bg-[#e94560] text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={15} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </nav>
  );
}
