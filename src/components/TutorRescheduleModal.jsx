// src/components/TutorRescheduleModal.jsx
import React, { useState } from "react";
import axios from "axios";

const API = "https://lms-back-nh5h.onrender.com";

const TutorRescheduleModal = ({ booking, onClose }) => {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const token = localStorage.getItem("token");

  const handleTutorReschedule = async () => {
    if (!newDate || !newTime) {
      return alert("Please select date and time");
    }

    try {
      await axios.patch(
        `${API}/api/bookings/tutor-reschedule/${booking._id}`,
        {
          date: newDate,
          time: newTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Booking rescheduled");
      onClose();
    } catch (err) {
      console.error("Tutor reschedule failed:", err);
      alert("Failed to reschedule");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold text-blue-600 mb-4">
          Tutor Reschedule
        </h2>

        <label className="block mb-3">
          <span className="text-sm font-medium">New Date</span>
          <input
            type="date"
            className="w-full p-2 border rounded mt-1"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm font-medium">New Time</span>
          <input
            type="time"
            className="w-full p-2 border rounded mt-1"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
        </label>

        <button
          onClick={handleTutorReschedule}
          className="w-full bg-blue-600 text-white py-2 rounded mt-4"
        >
          Save Changes
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-300 py-2 rounded mt-3"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TutorRescheduleModal;
