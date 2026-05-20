import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!adminToken || user?.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
}

export default AdminProtectedRoute;