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


  /* ===============================
        LOAD TUTOR BOOKINGS
  =============================== */
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

  /* ===============================
        ACCEPT BOOKING
  =============================== */
  const handleAccept = async (id) => {
    try {
      await axios.patch(`${API}/api/bookings/accept/${id}`, {}, authHeader);
      loadBookings();
    } catch (err) {
      console.error("Accept error:", err);
      alert("Failed to accept booking");
    }
  };

  /* ===============================
        DECLINE BOOKING
  =============================== */
  const handleDecline = async (id) => {
    try {
      await axios.patch(`${API}/api/bookings/decline/${id}`, {}, authHeader);
      loadBookings();
    } catch (err) {
      console.error("Decline error:", err);
      alert("Failed to decline booking");
    }
  };

  /* ===============================
        OPEN/CLOSE RESCHEDULE MODAL
  =============================== */
  const openReschedule = (booking) => setSelectedBooking(booking);
  const closeReschedule = () => {
    setSelectedBooking(null);
    loadBookings();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="border p-5 rounded-xl shadow bg-white"
            >
              {/* STUDENT INFO */}
              <p className="text-lg font-semibold">
                Student:{" "}
                <span className="text-blue-600">
                  {b.studentId?.name || "Unknown Student"}
                </span>
              </p>

              <p className="text-sm text-gray-600">
                Email: {b.studentId?.email || "N/A"}
              </p>

              {/* DATE & TIME */}
              <p className="mt-2">
                <strong>Date:</strong> {b.date}
              </p>
              <p>
                <strong>Time:</strong> {b.time}
              </p>

              {/* STATUS */}
              <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    b.tutorStatus === "accepted"
                      ? "text-green-600"
                      : b.tutorStatus === "declined"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }
                >
                  {b.tutorStatus}
                </span>
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Booked On: {new Date(b.createdAt).toLocaleString()}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mt-4">
                {b.tutorStatus === "scheduled" && (
                  <>
                    <button
                      onClick={() => handleAccept(b._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleDecline(b._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Decline
                    </button>
                  </>
                )}

                <button
                  onClick={() => openReschedule(b)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {selectedBooking && (
        <TutorRescheduleModal
          booking={selectedBooking}
          onClose={closeReschedule}
        />
      )}
    </div>
  );
};

export default TutorBookings;
