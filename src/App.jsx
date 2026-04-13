import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyOtp />} />
      </Routes>
    </BrowserRouter>
  );
}
