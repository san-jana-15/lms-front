import { useEffect, useState } from "react";
import axios from "axios";

const PaymentHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
      setHistory(res.data.paymentHistory || []);
    };
    fetchHistory();
  }, [userId]);

  return (
    <div className="border rounded p-4 mt-6 bg-white shadow">
      <h3 className="text-lg font-bold mb-3">Payment History</h3>
      {history.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Tutor</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => (
              <tr key={i}>
                <td className="border p-2">{item.tutorName}</td>
                <td className="border p-2">₹{item.amount}</td>
                <td className="border p-2">{item.date}</td>
                <td className="border p-2">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payments found.</p>
      )}
    </div>
  );
};

export default PaymentHistory;
