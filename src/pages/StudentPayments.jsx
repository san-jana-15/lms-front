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
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta">
      <StudentSidebar />

      <div className="flex-1 p-10 overflow-y-auto">

        <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          My Payments
        </h1>

        {loading ? (
          <p className="text-lg text-gray-600">Loading...</p>
        ) : payments.length === 0 ? (
          <p className="text-gray-600">You haven't made any payments yet.</p>
        ) : (
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-700">
                  <th className="py-3 font-semibold">Type / Recording</th>
                  <th className="font-semibold">Amount</th>
                  <th className="font-semibold">Tutor</th>
                  <th className="font-semibold">Date</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-purple-50/40 transition">
                    <td className="py-3">
                      {p.recording
                        ? p.recording.originalFileName
                        : "Booking Payment"}
                    </td>

                    <td className="font-semibold text-green-600">
                      ₹{p.amount}
                    </td>

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
