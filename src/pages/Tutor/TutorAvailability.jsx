// src/pages/TutorAvailability.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const TutorAvailability = () => {
  const [day, setDay] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [slots, setSlots] = useState([]);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const API = "https://lms-back-nh5h.onrender.com";

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const { data } = await axios.get(`${API}/api/availability`, { headers });
      setSlots(data);
    } catch (err) {
      console.log("Load error:", err);
    }
  };

  const addSlot = async () => {
    if (!day || !start || !end) return alert("Please fill all fields");

    try {
      await axios.post(
        `${API}/api/availability`,
        { day, startTime: start, endTime: end },
        { headers }
      );
      setDay("");
      setStart("");
      setEnd("");
      loadSlots();
    } catch (err) {
      alert("Failed to add slot");
    }
  };

  const removeSlot = async (id) => {
    try {
      await axios.delete(`${API}/api/availability/${id}`, { headers });
      loadSlots();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen font-jakarta bg-gradient-to-br from-purple-50 to-blue-50 p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">
        🕒 Tutor Availability
      </h2>

      <div className="bg-white shadow-xl rounded-2xl p-6 border mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Add New Availability
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="border p-3 rounded-xl focus:ring-2 focus:ring-purple-300"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            <option value="">Select Day</option>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <input
            type="time"
            className="border p-3 rounded-xl focus:ring-2 focus:ring-purple-300"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />

          <input
            type="time"
            className="border p-3 rounded-xl focus:ring-2 focus:ring-purple-300"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />

          <button
            onClick={addSlot}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl shadow hover:opacity-90 transition"
          >
            Add Slot
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Availability</h3>

      <ul className="space-y-4">
        {slots.length === 0 && (
          <p className="text-gray-600 italic">No availability added yet.</p>
        )}

        {slots.map((slot) => (
          <li
            key={slot._id}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow border hover:shadow-lg transition"
          >
            <span className="font-medium text-gray-700">
              {slot.day} — {slot.startTime} to {slot.endTime}
            </span>

            <button
              onClick={() => removeSlot(slot._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TutorAvailability;
