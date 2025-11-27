import React, { useEffect, useState } from "react";
import axios from "axios";

const TutorAvailability = () => {
  const [day, setDay] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [slots, setSlots] = useState([]);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadSlots();
  }, []);

  const API = "https://lms-back-nh5h.onrender.com";

  const loadSlots = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/availability`,
        { headers }
      );
      setSlots(data);
    } catch (error) {
      console.log("GET ERROR:", error.response?.data || error);
    }
  };

  const addSlot = async () => {
    if (!day || !start || !end) return alert("Fill all fields");

    try {
      await axios.post(
        `${API}/api/availability`,
        { day, startTime: start, endTime: end },
        { headers }
      );
      loadSlots();
    } catch (error) {
      console.log("POST ERROR:", error.response?.data || error);
      alert("Failed to add slot");
    }
  };

  const removeSlot = async (id) => {
    try {
      await axios.delete(
        `${API}/api/availability/${id}`,
        { headers }
      );
      loadSlots();
    } catch (error) {
      console.log("DELETE ERROR:", error.response?.data || error);
    }
  };


  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Page Heading */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Tutor Availability
      </h2>

      {/* Form Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Add New Availability
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
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
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />

          <input
            type="time"
            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition"
            onClick={addSlot}
          >
            Add Slot
          </button>
        </div>
      </div>

      {/* Availability List */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Availability</h3>

      <ul className="space-y-3">
        {slots.length === 0 && (
          <p className="text-gray-600 italic">No availability added yet.</p>
        )}

        {slots.map((slot) => (
          <li
            key={slot._id}
            className="flex justify-between items-center bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <span className="font-medium text-gray-700">
              {slot.day} — {slot.startTime} to {slot.endTime}
            </span>

            <button
              className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              onClick={() => removeSlot(slot._id)}
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
