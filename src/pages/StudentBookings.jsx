// src/pages/Student/StudentBookings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import RescheduleModal from "../components/RescheduleModal";

const API = "https://lms-back-nh5h.onrender.com";

const StudentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

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
    } catch {
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
      loadBookings();
    } catch (err) {
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
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-white shadow-md border rounded-xl hover:bg-gray-50 text-gray-700 transition"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              My Bookings
            </h1>
          </div>

          <div className="text-sm text-gray-600">
            {loading ? "Loading..." : `${bookings.length} booking(s)`}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 backdrop-blur">

          {/* Desktop Header Row */}
          <div className="hidden md:grid grid-cols-6 gap-4 text-gray-700 font-semibold pb-3 border-b mb-4 text-sm">
            <div>Tutor</div>
            <div>Email</div>
            <div>Date</div>
            <div>Time</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Booking List */}
          {loading ? (
            <p className="text-center py-10 text-gray-500 text-lg">Loading...</p>
          ) : bookings.length === 0 ? (
            <p className="text-center py-10 text-gray-600 text-lg">No bookings found.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center p-5 rounded-2xl border bg-gradient-to-r from-white to-purple-50 hover:shadow-lg transition"
                >
                  <div className="font-bold text-blue-700">{b.tutorId?.name || "Tutor"}</div>

                  <div className="text-sm text-gray-600">{b.tutorId?.email || "—"}</div>

                  <div className="text-sm font-medium">{b.date}</div>

                  <div className="text-sm">{b.time}</div>

                  <div>
                    <span
                      className={`px-4 py-1 text-sm rounded-full font-medium shadow border ${
                        b.tutorStatus === "accepted"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : b.tutorStatus === "declined"
                          ? "bg-red-100 text-red-700 border-red-300"
                          : "bg-yellow-100 text-yellow-700 border-yellow-300"
                      }`}
                    >
                      {b.tutorStatus}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openReschedule(b)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm shadow transition"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => handleCancel(b._id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm shadow transition"
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
