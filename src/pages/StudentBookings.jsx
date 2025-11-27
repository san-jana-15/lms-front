// src/pages/Student/StudentBookings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import RescheduleModal from "../components/RescheduleModal";

const StudentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const loadBookings = async () => {
    try {
      const res = await axios.get(
        "https://lms-back-nh5h.onrender.com/api/bookings/student",
        authHeader
      );
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel?")) return;

    try {
      await axios.patch(
        `https://lms-back-nh5h.onrender.com/api/bookings/cancel/${id}`,
        {},
        authHeader
      );

      loadBookings();
    } catch (err) {
      console.error("Cancel error:", err);
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
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {/* WHITE CONTAINER LIKE PAYMENTS PAGE */}
      <div className="bg-white rounded-2xl shadow-sm border max-w-7xl mx-auto p-6">

        {/* TABLE HEADER */}
        <div className="grid grid-cols-6 font-semibold text-gray-700 pb-4 border-b">
          <div>Tutor</div>
          <div>Email</div>
          <div>Date</div>
          <div>Time</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* TABLE ROWS */}
        {loading ? (
          <p className="text-center py-6 text-gray-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center py-6 text-gray-600">No bookings found.</p>
        ) : (
          bookings.map((b) => (
            <div
              key={b._id}
              className="grid grid-cols-6 py-4 border-b items-center text-sm"
            >
              <div className="text-blue-600 font-medium">{b.tutorId?.name}</div>
              <div>{b.tutorId?.email}</div>
              <div>{b.date}</div>
              <div>{b.time}</div>

              <div
                className={
                  b.tutorStatus === "accepted"
                    ? "text-green-600"
                    : b.tutorStatus === "declined"
                      ? "text-red-600"
                      : "text-yellow-600"
                }
              >
                {b.tutorStatus}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => openReschedule(b)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                >
                  Reschedule
                </button>

                <button
                  onClick={() => handleCancel(b._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedBooking && (
        <RescheduleModal booking={selectedBooking} onClose={closeReschedule} />
      )}
    </div>
  );
};

export default StudentBookings;
