// src/pages/Tutor/TutorBookings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import TutorRescheduleModal from "../../components/TutorRescheduleModal";

const TutorBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const API = "https://lms-back-nh5h.onrender.com";

  const loadBookings = async () => {
    try {
      const res = await axios.get(`${API}/api/bookings/tutor`, authHeader);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Load tutor bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axios.patch(`${API}/api/bookings/accept/${id}`, {}, authHeader);
      loadBookings();
    } catch {
      alert("Failed to accept booking");
    }
  };

  const handleDecline = async (id) => {
    try {
      await axios.patch(`${API}/api/bookings/decline/${id}`, {}, authHeader);
      loadBookings();
    } catch {
      alert("Failed to decline booking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta p-8">
      <h1 className="text-3xl font-extrabold text-purple-700 mb-6">
        📅 My Bookings
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white p-6 rounded-2xl shadow-xl border hover:shadow-2xl transition"
            >
              <p className="text-lg font-semibold">
                Student:{" "}
                <span className="text-blue-600">
                  {b.studentId?.name || "Unknown Student"}
                </span>
              </p>

              <p className="text-sm text-gray-600">
                Email: {b.studentId?.email || "N/A"}
              </p>

              <p className="mt-3">
                <strong>Date:</strong> {b.date}
              </p>
              <p>
                <strong>Time:</strong> {b.time}
              </p>

              <p className="mt-3 font-medium">
                Status:{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    b.tutorStatus === "accepted"
                      ? "bg-green-100 text-green-700"
                      : b.tutorStatus === "declined"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {b.tutorStatus}
                </span>
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Booked On: {new Date(b.createdAt).toLocaleString()}
              </p>

              <div className="flex gap-4 mt-5">
                {b.tutorStatus === "scheduled" && (
                  <>
                    <button
                      onClick={() => handleAccept(b._id)}
                      className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleDecline(b._id)}
                      className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </>
                )}

                <button
                  onClick={() => setSelectedBooking(b)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <TutorRescheduleModal
          booking={selectedBooking}
          onClose={() => {
            setSelectedBooking(null);
            loadBookings();
          }}
        />
      )}
    </div>
  );
};

export default TutorBookings;
