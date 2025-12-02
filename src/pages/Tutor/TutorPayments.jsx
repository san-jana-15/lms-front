// src/pages/TutorPayments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const TutorPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "https://lms-back-nh5h.onrender.com";

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/payments/tutor`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPayments(res.data || []);
    } catch (err) {
      console.error("Error loading payments:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta p-6">
      <h2 className="text-3xl font-extrabold text-purple-700 mb-6">
        💰 Earnings & Payments
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-600 bg-white shadow p-6 rounded-2xl border w-fit">
          No payments recorded yet.
        </p>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-xl border">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <th className="py-3 px-4 text-left rounded-l-xl">Student</th>
                <th className="py-3 text-left">Type</th>
                <th className="py-3 text-left">Amount</th>
                <th className="py-3 text-left rounded-r-xl">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr
                  key={p._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {p.student?.name || "Student"}
                  </td>

                  <td className="text-gray-700">
                    {p.recording
                      ? p.recording.originalFileName
                      : "Booking Payment"}
                  </td>

                  <td className="font-semibold text-green-600">
                    ₹{p.amount}
                  </td>

                  <td className="text-gray-500">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TutorPayments;
