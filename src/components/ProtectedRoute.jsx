import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) return <Navigate to="/login" />;
  return children;
}

export function SecureRoute({ children }) {
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (!isExpired) {
        return <Navigate to="/" />;
      }
    } catch {
      return children;
    }
  }

  return children;
}
