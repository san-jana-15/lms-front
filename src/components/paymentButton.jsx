// src/components/paymentButton.jsx
import React from "react";
import axios from "axios";

const API = "https://lms-back-nh5h.onrender.com";

const PaymentButton = ({ recordingId, amount, tutorId, onPaid }) => {
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      // get student email
      const profile = await axios.get(`${API}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const email = profile.data.email;

      // verify payment
      const res = await axios.post(
        `${API}/api/payments/verify`,
        {
          tutorId,
          amount,
          recording: recordingId,
          email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        alert("Payment successful!");
        onPaid(recordingId);
      } else {
        alert("Payment failed.");
      }
    } catch (err) {
      alert("Payment failed.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-xl shadow hover:opacity-90 font-jakarta"
    >
      Pay ₹{amount}
    </button>
  );
};

export default PaymentButton;
