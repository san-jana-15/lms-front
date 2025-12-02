// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-jakarta">
        <div className="bg-white p-8 rounded-2xl shadow-xl border text-center max-w-sm">
          <h2 className="text-xl font-bold text-purple-600 mb-3">Access Denied</h2>
          <p className="text-gray-600 mb-6">You must log in to continue.</p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
