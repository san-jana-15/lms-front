// src/components/PaymentHistory.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://lms-back-nh5h.onrender.com";

const PaymentHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API}/api/auth/profile/${userId}`);
        setHistory(res.data.paymentHistory || []);
      } catch (err) {
        console.error("Payment history fetch error:", err);
        setError("Unable to load payment history.");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchHistory();
  }, [userId]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-6 font-jakarta">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment History</h3>

      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading payments...</div>
      ) : error ? (
        <div className="py-6 text-center text-red-500">{error}</div>
      ) : history.length === 0 ? (
        <div className="py-6 text-center text-gray-600">No payments found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b">
                <th className="py-3 px-3">Tutor</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-3 text-sm text-gray-700">{item.tutorName || "—"}</td>
                  <td className="py-3 px-3 text-sm font-medium text-green-600">₹{item.amount}</td>
                  <td className="py-3 px-3 text-sm text-gray-500">{item.date}</td>
                  <td className="py-3 px-3 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        item.status?.toLowerCase() === "success"
                          ? "bg-green-100 text-green-700"
                          : item.status?.toLowerCase() === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status || "—"}
                    </span>
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

export default PaymentHistory;
