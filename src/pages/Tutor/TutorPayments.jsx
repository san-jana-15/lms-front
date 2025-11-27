// src/pages/TutorPayments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../axiosClient";

const TutorPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/payments/tutor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // If server returns tutor payments without population, consider populating in backend.
      setPayments(res.data || []);
    } catch (err) {
      console.error("Error loading payments:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Payments</h2>

      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-600">No payments yet.</p>
      ) : (
        <div className="bg-white shadow p-6 rounded-xl">
          <table className="w-full">
            <thead>
              <tr className="border-b text-gray-700 text-left">
                <th className="py-3">Student</th>
                <th>Type / Recording</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="py-3">{p.student?.name || p.email || p.student || "Student"}</td>

                  <td>{p.recording ? p.recording.originalFileName : "Booking Payment"}</td>

                  <td className="font-semibold text-green-600">₹{p.amount}</td>

                  <td>{new Date(p.createdAt || p.date).toLocaleString()}</td>
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
