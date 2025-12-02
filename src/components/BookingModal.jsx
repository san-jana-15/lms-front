// src/components/BookingModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://lms-back-nh5h.onrender.com";

const BookingModal = ({ tutor, onClose }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availability, setAvailability] = useState([]);
  the[filteredTimes, setFilteredTimes] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const tutorUserId = tutor?.userId;

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!tutorUserId) return setAvailability([]);
      try {
        setLoadingAvail(true);
        const res = await axios.get(`${API}/api/availability/${tutorUserId}`);
        setAvailability(res.data || []);
      } catch (err) {
        setAvailability([]);
      } finally {
        setLoadingAvail(false);
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const profile = await axios.get(`${API}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserEmail(profile.data?.email || "");
      } catch {}
    };

    fetchAvailability();
    fetchUser();
  }, [tutorUserId]);

  useEffect(() => {
    if (!selectedDate) {
      setFilteredTimes([]);
      return;
    }

    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
      setFilteredTimes([]);
      return;
    }

    const dayName = selected.toLocaleDateString("en-US", { weekday: "long" });
    const slot = availability.find((s) => s.day === dayName);
    if (!slot) {
      setFilteredTimes([]);
      return;
    }

    const times = [];
    const [sh, sm] = slot.startTime.split(":").map(Number);
    const [eh, em] = slot.endTime.split(":").map(Number);

    let current = sh * 60 + sm;
    const end = eh * 60 + em;

    while (current <= end) {
      const h = String(Math.floor(current / 60)).padStart(2, "0");
      const m = String(current % 60).padStart(2, "0");
      times.push(`${h}:${m}`);
      current += 30;
    }

    setFilteredTimes(times);
  }, [selectedDate, availability]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime)
      return alert("Select a valid date and time");

    if (!tutor || !tutor.userId)
      return alert("Tutor profile is incomplete.");

    try {
      const token = localStorage.getItem("token");

      const pay = await axios.post(
        `${API}/api/fake-payment/pay`,
        {
          tutorId: tutor.userId,
          amount: tutor.hourlyRate,
          type: "booking",
          recording: null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!pay.data?.success) return alert("Payment failed");

      await axios.post(
        `${API}/api/bookings`,
        {
          tutorId: tutor.userId,
          subject: tutor.subjects?.[0] || "General",
          date: selectedDate,
          time: selectedTime,
          amount: tutor.hourlyRate,
          paymentStatus: "paid",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Booking Confirmed!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fadeIn border border-gray-100">
        
        {/* Header */}
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-1">
          Book {tutor?.name}
        </h2>
        <p className="text-center text-sm text-gray-500">{tutor?.headline}</p>

        {/* Availability */}
        <div className="mt-4 bg-purple-50 border border-purple-200 p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold text-purple-700 text-center mb-2">
            Tutor Availability
          </h3>

          {loadingAvail ? (
            <p className="text-gray-500 text-sm text-center">Loading...</p>
          ) : availability.length === 0 ? (
            <p className="text-red-600 text-sm text-center">
              Tutor has not set availability.
            </p>
          ) : (
            <ul className="text-sm text-gray-700 space-y-2 max-h-32 overflow-y-auto">
              {availability.map((slot) => (
                <li
                  key={slot._id}
                  className="flex justify-between bg-white px-3 py-2 rounded-lg shadow-sm border"
                >
                  <span className="font-medium">{slot.day}</span>
                  <span>
                    {slot.startTime} → {slot.endTime}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Date Selector */}
        <label className="block mt-5">
          <span className="text-sm font-medium text-gray-700">Select Date</span>
          <input
            type="date"
            className="w-full border p-3 rounded-lg mt-1 shadow-sm focus:ring-2 focus:ring-purple-400"
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime("");
            }}
          />
        </label>

        {/* Time Selector */}
        {filteredTimes.length > 0 ? (
          <label className="block mt-4">
            <span className="text-sm font-medium text-gray-700">Select Time</span>
            <select
              className="w-full border p-3 rounded-lg mt-1 shadow-sm focus:ring-2 focus:ring-purple-400"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">-- choose time --</option>
              {filteredTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        ) : selectedDate ? (
          <p className="text-red-600 text-sm mt-3">
            Tutor is not available on this date
          </p>
        ) : null}

        {/* Buttons */}
        <button
          className="w-full bg-purple-600 text-white py-3 rounded-xl mt-6 text-lg font-medium shadow-md hover:bg-purple-700 transition"
          onClick={handleBooking}
        >
          Pay & Book
        </button>

        <button
          className="w-full bg-gray-200 py-3 rounded-xl mt-3 text-gray-700 text-lg font-medium hover:bg-gray-300 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
