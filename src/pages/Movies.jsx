import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Clock, Globe, Star, X, ChevronRight } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

export default function Movies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(false);
  useEffect(() => {
    fetchMovies();
  }, []);

  const backend = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");
  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${backend}/api/movies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies(res.data.data);
    } catch {
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async (movie) => {
    setSelected(movie);
    setShowsLoading(true);
    try {
      const res = await axios.get(`${backend}/api/shows/movie/${movie.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShows(res.data.data);
    } catch {
      toast.error("No shows available");
    } finally {
      setShowsLoading(false);
    }
  };

  const handleSelectShow = (show) => {
    setSelected(null);
    navigate(`/seats/${show.id}`, { state: { show, movie: selected } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <p className="text-gray-400">Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-white text-2xl font-bold mb-6">Now Showing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#1a1a2e] rounded-2xl overflow-hidden border border-[#333] hover:border-[#e94560] transition"
            >
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-2">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-3 mb-1">
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={12} /> {movie.duration} min
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Globe size={12} /> {movie.language}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Star size={12} /> {movie.rating}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mb-4 line-clamp-2">
                  {movie.description}
                </p>
                <button
                  onClick={() => handleBookNow(movie)}
                  className="w-full bg-[#e94560] hover:bg-red-600 cursor-pointer text-white font-semibold py-2.5 rounded-lg transition text-sm"
                >
                  Book Seats
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-md border border-[#333] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">{selected.title}</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Select a show time — Rs. 500 per seat
            </p>
            {showsLoading ? (
              <p className="text-gray-400 text-center py-4">Loading shows...</p>
            ) : shows.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No shows available
              </p>
            ) : (
              shows.map((show) => (
                <div
                  key={show.id}
                  onClick={() => handleSelectShow(show)}
                  className="flex items-center justify-between bg-[#16213e] border border-[#333] hover:border-[#e94560] rounded-xl px-4 py-3 mb-3 cursor-pointer transition"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {new Date(show.show_time).toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {show.screen_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-bold">
                      Rs. {show.price}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
