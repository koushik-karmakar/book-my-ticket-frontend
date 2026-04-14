import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { RefreshCw } from "lucide-react";
const SEAT_PRICE = 500;

export default function Seats() {
  const { showId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { show, movie } = location.state || {};
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);

  useEffect(() => {
    fetchSeats();
    const interval = setInterval(fetchSeats, 30000);
    return () => clearInterval(interval);
  }, []);
  const backend = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");
  const fetchSeats = async () => {
    try {
      const res = await axios.get(`${backend}/api/seats/show/${showId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSeats(res.data.data);
    } catch {
      toast.error("Failed to load seats");
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.status !== "available") return;
    setSelected((prev) =>
      prev.includes(seat.id)
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id],
    );
  };

  const handleProceed = async () => {
    if (selected.length === 0) {
      toast.error("Select at least one seat");
      return;
    }
    setLocking(true);
    try {
      await axios.post(
        `${backend}/api/bookings/lock-seats`,
        {
          show_id: parseInt(showId),
          seat_ids: selected,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Seats locked for 3 minutes");
      navigate("/payment", {
        state: {
          show,
          movie,
          seat_ids: selected,
          total_amount: selected.length * SEAT_PRICE,
          showId: parseInt(showId),
          selectedSeats: seats.filter((s) => selected.includes(s.id)),
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to lock seats");
    } finally {
      setLocking(false);
    }
  };

  const getSeatStyle = (seat) => {
    if (seat.status === "booked")
      return "bg-[#e94560] cursor-not-allowed opacity-80";
    if (seat.status === "locked")
      return "bg-yellow-500 cursor-not-allowed opacity-80";
    if (selected.includes(seat.id))
      return "bg-indigo-500 scale-110 cursor-pointer";
    return "bg-[#2a2a4a] border border-gray-600 hover:border-green-400 hover:bg-[#3a3a5a] cursor-pointer";
  };

  const rows = [...new Set(seats.map((s) => s.seat_row))].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <p className="text-gray-400">Loading seats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />

      <div
        className={`max-w-4xl mx-auto px-4 py-8 ${selected.length > 0 ? "pb-28" : ""}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl font-bold">{movie?.title}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {show?.screen_name} &bull;{" "}
              {new Date(show?.show_time).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => {
              fetchSeats();
              setSelected([]);
              toast.success("Seats refreshed");
            }}
            className="flex items-center cursor-pointer gap-2 border border-[#333] hover:border-[#e94560] text-gray-400 hover:text-white text-sm px-4 py-2 rounded-lg transition"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:block">Refresh</span>
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-3/4 h-2 bg-linear-to-b from-white/40 to-transparent rounded-t-full" />
        </div>
        <p className="text-center text-gray-500 text-xs mb-8 tracking-widest uppercase">
          Screen
        </p>

        <div className="flex flex-col items-center gap-1.5 mb-8 w-full">
          {rows.map((row) => {
            const rowSeats = seats
              .filter((s) => s.seat_row === row)
              .sort(
                (a, b) => parseInt(a.seat_number) - parseInt(b.seat_number),
              );

            return (
              <div
                key={row}
                className="flex items-center gap-1 w-full justify-center"
              >
                <span className="text-gray-500 text-xs w-4 text-right shrink-0">
                  {row}
                </span>
                <div className="flex gap-1 sm:gap-1.5">
                  {rowSeats.map((seat, idx) => (
                    <div key={seat.id} className="flex items-center">
                      {idx === 5 && <div className="w-2 sm:w-4 shrink-0" />}
                      <button
                        onClick={() => toggleSeat(seat)}
                        className={`w-7 h-7 sm:w-12 sm:h-12 rounded text-[10px] sm:text-sm font-semibold text-white transition-all ${getSeatStyle(seat)}`}
                        title={`${seat.seat_row}${seat.seat_number}`}
                      >
                        {seat.seat_number}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
          {[
            {
              color: "bg-[#2a2a4a] border border-gray-600",
              label: "Available",
            },
            { color: "bg-indigo-500", label: "Selected" },
            { color: "bg-yellow-500", label: "Locked" },
            { color: "bg-[#e94560]", label: "Booked" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded ${color}`} />
              <span className="text-gray-400 text-xs">{label}</span>
            </div>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e] border-t border-[#333] px-6 py-4 flex items-center justify-between z-50">
            <div>
              <p className="text-gray-400 text-sm">
                {selected.length} seat(s) selected
              </p>
              <p className="text-green-400 font-bold text-xl">
                Rs. {selected.length * SEAT_PRICE}
              </p>
            </div>
            <button
              onClick={handleProceed}
              disabled={locking}
              className="bg-[#e94560] hover:bg-red-600 cursor-pointer text-white font-semibold px-8 py-3 rounded-xl transition disabled:opacity-50"
            >
              {locking ? "Locking..." : "Proceed to Pay"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
