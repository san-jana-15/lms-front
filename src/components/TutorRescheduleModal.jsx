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
        { date: newDate, time: newTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Booking rescheduled");
      onClose();
    } catch (err) {
      alert("Failed to reschedule");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 font-jakarta border">

        {/* Header */}
        <h2 className="text-xl font-extrabold text-purple-700 text-center mb-4">
          Reschedule Session
        </h2>

        {/* Date */}
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">New Date</span>
          <input
            type="date"
            className="w-full p-2 border rounded-xl mt-1 focus:ring-2 focus:ring-purple-300"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </label>

        {/* Time */}
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">New Time</span>
          <input
            type="time"
            className="w-full p-2 border rounded-xl mt-1 focus:ring-2 focus:ring-purple-300"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
        </label>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleTutorReschedule}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-xl shadow hover:opacity-95"
          >
            Save Changes
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-xl hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default TutorRescheduleModal;
