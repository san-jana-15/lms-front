// src/pages/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const navigate = useNavigate();

  const API = "https://lms-back-nh5h.onrender.com";

  useEffect(() => {
    axios
      .get(`${API}/api/tutors`)
      .then((res) => {
        const t = res.data.find((x) => x._id === tutorId);
        setTutor(t);
      })
      .catch((err) => console.error(err));
  }, [tutorId]);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePay = async () => {
    if (!email) {
      alert("Please enter your email to continue.");
      return;
    }
    if (!agree) {
      alert("Please accept the Terms to continue.");
      return;
    }

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      setLoadingOrder(true);
      const amount = Number(tutor.price || 0);

      const { data: order } = await axios.post(`${API}/api/payments/create-order`, { amount });

      const options = {
        key: "rzp_test_1234567890", // replace with your key
        amount: order.amount,
        currency: order.currency || "INR",
        name: "LMS Checkout",
        description: `Payment for ${tutor.name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post(`${API}/api/payments/verify`, {
              tutorId,
              amount,
              email,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert("Payment successful — thank you!");
            navigate("/dashboard");
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification failed.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    } finally {
      setLoadingOrder(false);
    }
  };

  if (!tutor) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Checkout</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">1. Account</h3>
              <p className="text-sm text-gray-600 mb-3">
                A valid email is required to access your session and receipts.
              </p>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border p-3 rounded-xl mb-3 focus:ring-2 focus:ring-purple-200"
              />

              <button
                onClick={() => alert("Continue (simulate login)")}
                className="inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
              >
                Continue
              </button>
            </div>

            <div>
              <h3 className="font-medium mb-2">2. Billing & payment</h3>
              <p className="text-sm text-gray-600 mb-3">Your payment is processed securely.</p>

              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                  className="form-checkbox h-5 w-5 rounded"
                />
                <span className="text-sm text-gray-700">
                  I agree to the <u>Terms of Use</u> and <u>Privacy Policy</u>
                </span>
              </label>

              <div className="mt-6">
                <button
                  onClick={handlePay}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:opacity-95 disabled:opacity-60"
                  disabled={loadingOrder}
                >
                  {loadingOrder ? "Processing…" : `Pay ₹${tutor.price || 0}`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <aside className="bg-white p-6 rounded-2xl shadow-lg border">
          <h3 className="text-lg font-semibold mb-4">Order summary</h3>

          <div className="flex items-center gap-4">
            <img
              src={tutor.image || "/mnt/data/Screenshot 2025-11-20 190636.png"}
              alt={tutor.name}
              className="w-24 h-20 object-cover rounded-lg"
            />
            <div>
              <div className="font-semibold text-gray-800">{tutor.name}</div>
              <div className="text-sm text-gray-500">{tutor.subject}</div>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 text-sm text-gray-600">
            <div className="flex justify-between py-2">
              <span>Original Price:</span>
              <span className="line-through text-gray-400">₹{(tutor.price * 10) || 10000}</span>
            </div>

            <div className="flex justify-between py-2">
              <span>Discounts:</span>
              <span className="text-green-600">-₹{(tutor.price * 9) || 9000}</span>
            </div>

            <div className="flex justify-between py-3 font-bold text-lg">
              <span>Total:</span>
              <span>₹{tutor.price || 0}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
