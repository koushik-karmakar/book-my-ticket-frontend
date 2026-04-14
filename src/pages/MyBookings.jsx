import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Ticket } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const backend = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${backend}/api/bookings/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data.data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <p className="text-gray-400">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-white text-2xl font-bold mb-6">My Bookings</h2>
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <Ticket size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No bookings yet</p>
            <button
              onClick={() => navigate("/movies")}
              className="bg-[#e94560] hover:bg-red-600 cursor-pointer text-white px-6 py-2.5 rounded-xl transition text-sm"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#333]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-base">
                      {b.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {new Date(b.show_time).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${b.status === "confirmed" ? "bg-green-400/20 text-green-400" : "bg-red-400/20 text-red-400"}`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {b.seats?.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-500/20 text-indigo-300 text-xs font-mono px-2 py-1 rounded-md border border-indigo-500/30"
                    >
                      {s.seat_row}
                      {s.seat_number}
                    </span>
                  ))}
                </div>

                <div className="border-t border-[#333] pt-3 flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-mono">
                    Booking #{b.id}
                  </span>
                  <span className="text-green-400 font-bold">
                    Rs. {b.total_amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
