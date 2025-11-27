import React from "react";
import axios from "axios";

const API = "https://lms-back-nh5h.onrender.com";

const PaymentButton = ({ recordingId, amount, tutorId, onPaid }) => {

  const handlePayment = async () => {
    console.log("👉 ACTIVE PAYMENT BUTTON FILE");

    try {
      const token = localStorage.getItem("token");

      // Get student email
      const profile = await axios.get(`${API}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const email = profile.data.email;

      // Save payment in backend
      const res = await axios.post(
        `${API}/api/payments/verify`,
        {
          tutorId,
          amount,
          recording: recordingId,
          email,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("VERIFY RESPONSE:", res.data);

      if (res.status === 200) {
        alert("Payment successful!");
        onPaid(recordingId); 
        return;
      }

      alert("Payment failed!");

    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      alert("Payment failed!");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
    >
      Pay ₹{amount}
    </button>
  );
};

export default PaymentButton;
