import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckCircle, CreditCard } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { show, movie, seat_ids, total_amount, showId, selectedSeats } =
    location.state || {};
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState(null);
  const backend = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");
  const handlePay = async () => {
    setPaying(true);
    try {
      const bookingRes = await axios.post(
        `${backend}/api/bookings`,
        {
          show_id: showId,
          seat_ids,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const bookingData = bookingRes.data.data;
      await axios.post(
        `${backend}/api/payments/initiate`,
        { booking_id: bookingData.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await axios.post(
        `${backend}/api/payments/confirm`,
        {
          booking_id: bookingData.id,
          transaction_id: `TXN${Date.now()}`, //for demo payment, I use date
          payment_method: "upi",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setBooking(bookingData);
      setSuccess(true);
      toast.success("Payment successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };
  const handleCancel = async () => {
    try {
      await axios.post(
        `${backend}/api/bookings/release-seats`,
        { show_id: showId, seat_ids },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      toast.success("Failed to cancel.");
    }
    toast.success("Seat released.");
    navigate(`/seats/${showId}`, { state: { show, movie } });
  };
  if (success && booking) {
    return (
      <div className="min-h-screen bg-[#0f0f1a]">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-[#1a1a2e] rounded-2xl p-8 border border-[#333] text-center">
            <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
            <h2 className="text-white text-2xl font-bold mb-1">
              Booking Confirmed
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Your tickets have been booked
            </p>
            <div className="bg-[#16213e] rounded-xl p-5 text-left mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Movie</span>
                <span className="text-white text-sm font-medium">
                  {movie?.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Show Time</span>
                <span className="text-white text-sm">
                  {new Date(show?.show_time).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Screen</span>
                <span className="text-white text-sm">{show?.screen_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Seats</span>
                <span className="text-white text-sm">
                  {selectedSeats
                    ?.map((s) => `${s.seat_row}${s.seat_number}`)
                    .join(", ")}
                </span>
              </div>
              <div className="border-t border-[#333] pt-3 flex justify-between">
                <span className="text-gray-400 text-sm">Total Paid</span>
                <span className="text-green-400 font-bold text-lg">
                  Rs. {total_amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Booking ID</span>
                <span className="text-white text-sm font-mono">
                  #{booking.id}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/my-bookings")}
              className="w-full bg-[#e94560] hover:bg-red-600 cursor-pointer text-white font-semibold py-3 rounded-xl mb-3 transition"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate("/movies")}
              className="w-full border border-[#333] cursor-pointer text-gray-400 hover:text-white py-3 rounded-xl transition text-sm"
            >
              Back to Movies
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-8">
        <h2 className="text-white text-2xl font-bold mb-6">Payment</h2>
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-[#333] mb-4">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">
            Order Summary
          </p>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Movie</span>
              <span className="text-white text-sm font-medium">
                {movie?.title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Show Time</span>
              <span className="text-white text-sm">
                {new Date(show?.show_time).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Seats</span>
              <span className="text-white text-sm">
                {selectedSeats
                  ?.map((s) => `${s.seat_row}${s.seat_number}`)
                  .join(", ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Price per seat</span>
              <span className="text-white text-sm">
                Rs. 500 x {seat_ids?.length}
              </span>
            </div>
            <div className="border-t border-[#333] pt-3 flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-green-400 font-bold text-2xl">
                Rs. {total_amount}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-[#e94560] mb-6">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">
            Payment Method
          </p>
          <div className="flex items-center gap-3">
            <CreditCard size={22} className="text-[#e94560]" />
            <div>
              <p className="text-white text-sm font-medium">UPI / Pay Now</p>
              <p className="text-gray-400 text-xs">
                Click pay to confirm your booking instantly
              </p>
            </div>
            <div className="ml-auto w-3 h-3 rounded-full bg-[#e94560]" />
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={paying}
          className="w-full bg-[#e94560] hover:bg-red-600 cursor-pointer text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-50 mb-3"
        >
          {paying ? "Processing..." : `Pay Rs. ${total_amount}`}
        </button>
        <button
          onClick={handleCancel}
          className="w-full border border-[#333] cursor-pointer text-gray-400 hover:text-white py-3 rounded-xl transition text-sm"
        >
          Cancel and Go Back
        </button>
      </div>
    </div>
  );
}
