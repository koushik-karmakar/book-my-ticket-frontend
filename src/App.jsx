import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import Movies from "./pages/Movies.jsx";
import { ProtectedRoute, SecureRoute } from "./components/ProtectedRoute.jsx";
import Seats from "./pages/Seats.jsx";
import Payment from "./pages/Payment.jsx";
import MyBookings from "./pages/MyBookings.jsx";
export default function App() {
  const token = localStorage.getItem("access_token");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/movies" /> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={
            <SecureRoute>
              <Register />
            </SecureRoute>
          }
        />
        <Route
          path="/login"
          element={
            <SecureRoute>
              <Login />
            </SecureRoute>
          }
        />
        <Route
          path="/verify"
          element={
            <SecureRoute>
              <VerifyOtp />
            </SecureRoute>
          }
        />
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seats/:showId"
          element={
            <ProtectedRoute>
              <Seats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
