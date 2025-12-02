// src/components/RescheduleModal.jsx
import React, { useState } from "react";
import axios from "axios";

const API = "https://lms-back-nh5h.onrender.com";

const RescheduleModal = ({ booking, onClose }) => {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const token = localStorage.getItem("token");

  const handleStudentReschedule = async () => {
    if (!newDate || !newTime) return alert("Please select date and time");

    try {
      await axios.patch(
        `${API}/api/bookings/reschedule/${booking._id}`,
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl border font-jakarta">

        <h2 className="text-xl font-extrabold text-purple-700 mb-4 text-center">
          Reschedule Booking
        </h2>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">New Date</span>
          <input
            type="date"
            className="w-full p-2 border rounded-xl mt-1 focus:ring-2 focus:ring-purple-300"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">New Time</span>
          <input
            type="time"
            className="w-full p-2 border rounded-xl mt-1 focus:ring-2 focus:ring-purple-300"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
        </label>

        <button
          onClick={handleStudentReschedule}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-xl shadow hover:opacity-95"
        >
          Save Changes
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-300 py-2 rounded-xl mt-3 hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RescheduleModal;
