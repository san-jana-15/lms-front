// src/pages/StudentPayments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentSidebar from "../components/StudentSidebar";

const StudentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://lms-back-nh5h.onrender.com/api/payments/student",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPayments(res.data || []);
    } catch (err) {
      console.error("Error loading payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">My Payments</h1>

        {loading ? (
          <p>Loading...</p>
        ) : payments.length === 0 ? (
          <p className="text-gray-600">You haven't made any payments yet.</p>
        ) : (
          <div className="bg-white rounded-xl shadow p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-gray-700">
                  <th className="py-3">Type / Recording</th>
                  <th>Amount</th>
                  <th>Tutor</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-b">
                    <td className="py-3">
                      {p.recording ? p.recording.originalFileName : "Booking Payment"}
                    </td>
                    <td className="font-semibold text-green-600">₹{p.amount}</td>
                    <td>{p.tutor?.name || p.tutor || "Tutor"}</td>
                    <td>{new Date(p.createdAt || p.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPayments;
