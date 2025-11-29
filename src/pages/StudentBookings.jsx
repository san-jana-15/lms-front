// src/pages/Student/StudentBookings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import RescheduleModal from "../components/RescheduleModal"; // fixed relative path

const API = "https://lms-back-nh5h.onrender.com";

const StudentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // build auth header safely
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const auth = getAuthHeader();
      const res = await axios.get(`${API}/api/bookings/student`, auth);
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel?")) return;

    try {
      const auth = getAuthHeader();
      await axios.patch(`${API}/api/bookings/cancel/${id}`, {}, auth);
      // optimistic reload
      await loadBookings();
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const openReschedule = (booking) => setSelectedBooking(booking);
  const closeReschedule = () => {
    setSelectedBooking(null);
    loadBookings();
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Back + Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-sm"
            >
              ← Back
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-700">My Bookings</h1>
          </div>

          <div className="text-sm text-gray-500">
            {loading ? "Loading bookings..." : `${bookings.length} booking(s)`}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-4">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-6 gap-4 font-semibold text-gray-700 pb-3 border-b mb-3 text-sm">
            <div>Tutor</div>
            <div>Email</div>
            <div>Date</div>
            <div>Time</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Rows */}
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : bookings.length === 0 ? (
            <p className="text-center py-8 text-gray-600">No bookings found.</p>
          ) : (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4 items-center py-3 border-b last:border-b-0"
                >
                  <div className="md:col-span-1">
                    <div className="text-blue-600 font-medium">{b.tutorId?.name || "Tutor"}</div>
                  </div>

                  <div className="md:col-span-1 text-sm text-gray-600">{b.tutorId?.email || "—"}</div>

                  <div className="md:col-span-1 text-sm">{b.date}</div>

                  <div className="md:col-span-1 text-sm">{b.time}</div>

                  <div className="md:col-span-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        b.tutorStatus === "accepted"
                          ? "bg-green-50 text-green-700"
                          : b.tutorStatus === "declined"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {b.tutorStatus}
                    </span>
                  </div>

                  <div className="md:col-span-1 flex justify-end gap-2">
                    <button
                      onClick={() => openReschedule(b)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm shadow"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => handleCancel(b._id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm shadow"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedBooking && (
          <RescheduleModal booking={selectedBooking} onClose={closeReschedule} />
        )}
      </div>
    </div>
  );
};

export default StudentBookings;
