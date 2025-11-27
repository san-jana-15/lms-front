// src/components/BookingModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const BookingModal = ({ tutor, onClose }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availability, setAvailability] = useState([]);
  const [filteredTimes, setFilteredTimes] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const tutorUserId = tutor?.userId;

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!tutorUserId) return setAvailability([]);
      try {
        setLoadingAvail(true);
        const res = await axios.get(`http://localhost:5000/api/availability/${tutorUserId}`);
        setAvailability(res.data || []);
      } catch (err) {
        console.error("Availability fetch error:", err);
        setAvailability([]);
      } finally {
        setLoadingAvail(false);
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const profile = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserEmail(profile.data?.email || "");
      } catch (err) {
        // ignore
      }
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
    if (!selectedDate || !selectedTime) {
      return alert("Select a valid date and time");
    }

    if (!tutor || !tutor.userId) {
      return alert("Tutor profile is incomplete. Cannot create booking.");
    }

    try {
      const token = localStorage.getItem("token");

      // Save payment (booking payment)
      const pay = await axios.post(
        "http://localhost:5000/api/fake-payment/pay",
        {
          tutorId: tutor.userId,     // FIXED 100% correct
          amount: tutor.hourlyRate,
          type: "booking",
          recording: null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!pay.data || !pay.data.success) {
        return alert("Payment failed");
      }

      // Create booking with correct tutorId
      await axios.post(
        "http://localhost:5000/api/bookings",
        {
          tutorId: tutor.userId,     // FIXED 100% correct
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
      console.error("Booking error:", err.response?.data || err);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-purple-700 text-center">Book {tutor?.name}</h2>

        <p className="text-center text-sm text-gray-600 mb-3">{tutor?.headline}</p>

        <div className="mt-3 bg-purple-50 border border-purple-200 p-3 rounded-lg">
          <h3 className="font-semibold text-purple-700 mb-2 text-center">Tutor Availability</h3>

          {loadingAvail ? (
            <p className="text-gray-500 text-sm text-center">Loading availability...</p>
          ) : availability.length === 0 ? (
            <p className="text-red-600 text-sm text-center">Tutor has not set availability.</p>
          ) : (
            <ul className="text-sm text-gray-700 space-y-1">
              {availability.map((slot) => (
                <li key={slot._id} className="flex justify-between bg-white px-3 py-1 rounded shadow-sm">
                  <span className="font-medium">{slot.day}</span>
                  <span>{slot.startTime} → {slot.endTime}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="block mt-4">
          <span className="text-sm font-medium">Select Date</span>
          <input
            type="date"
            className="w-full border p-2 rounded mt-1"
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }}
          />
        </label>

        {filteredTimes.length > 0 ? (
          <label className="block mt-4">
            <span className="text-sm font-medium">Select Time</span>
            <select
              className="w-full border p-2 rounded mt-1"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">-- choose time --</option>
              {filteredTimes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        ) : selectedDate ? (
          <p className="text-red-600 text-sm mt-3">Tutor is not available on this date</p>
        ) : null}

        <button className="w-full bg-purple-600 text-white py-2 rounded-lg mt-5 hover:bg-purple-700 transition" onClick={handleBooking}>
          Pay & Book
        </button>

        <button className="mt-3 w-full bg-gray-300 py-2 rounded-lg" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BookingModal;
