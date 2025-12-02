// src/components/StudentSidebar.jsx
import React from "react";
import { FiHome, FiBookOpen, FiVideo, FiUser, FiLogOut } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <aside className="w-64 bg-white shadow-xl border-r flex flex-col h-screen font-jakarta">

      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          LMS
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3">

        <button
          onClick={() => navigate("/dashboard/student")}
          className={`flex items-center gap-3 w-full p-3 rounded-xl transition 
            ${isActive("/dashboard/student") && !isActive("bookings") && !isActive("payments") && !isActive("recordings")
              ? "bg-purple-100 text-purple-700 shadow-sm"
              : "text-gray-700 hover:bg-purple-100"}`}
        >
          <FiHome /> Dashboard
        </button>

        <button
          onClick={() => navigate("/dashboard/student/bookings")}
          className={`flex items-center gap-3 w-full p-3 rounded-xl transition 
            ${isActive("bookings")
              ? "bg-purple-100 text-purple-700 shadow-sm"
              : "text-gray-700 hover:bg-purple-100"}`}
        >
          <FiBookOpen /> My Bookings
        </button>

        <button
          onClick={() => navigate("/dashboard/student/payments")}
          className={`flex items-center gap-3 w-full p-3 rounded-xl transition 
            ${isActive("payments")
              ? "bg-purple-100 text-purple-700 shadow-sm"
              : "text-gray-700 hover:bg-purple-100"}`}
        >
          💳 Payments
        </button>

        <button
          onClick={() => navigate("/dashboard/student/recordings")}
          className={`flex items-center gap-3 w-full p-3 rounded-xl transition 
            ${isActive("recordings")
              ? "bg-purple-100 text-purple-700 shadow-sm"
              : "text-gray-700 hover:bg-purple-100"}`}
        >
          <FiVideo /> Recordings
        </button>

        <button
          onClick={() => navigate("/dashboard/student/profile")}
          className={`flex items-center gap-3 w-full p-3 rounded-xl transition 
            ${isActive("profile")
              ? "bg-purple-100 text-purple-700 shadow-sm"
              : "text-gray-700 hover:bg-purple-100"}`}
        >
          <FiUser /> Profile
        </button>

      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
