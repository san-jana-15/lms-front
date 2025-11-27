import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(true);
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

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      const amount = Number(tutor.price || 0);

      const { data: order } = await axios.post(
        `${API}/api/payments/create-order`,
        { amount }
      );

      const options = {
        key: "rzp_test_1234567890",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "LMS Checkout",
        description: `Payment for ${tutor.name}`,
        order_id: order.id,

        handler: async (response) => {
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
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  };

  if (!tutor) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. Log in or create an account</h3>
              <p className="text-sm text-gray-600 mb-3">
                A valid email is required to access your session and receipts.
              </p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border p-3 rounded mb-3"
              />

              <button
                onClick={() => alert("Continue (simulate login)")}
                className="w-40 bg-purple-600 text-white py-2 rounded"
              >
                Continue
              </button>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Billing & payment</h3>
              <p className="text-sm text-gray-600 mb-3">
                Your payment is processed securely.
              </p>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                  className="mr-2"
                />
                I agree to the Terms of Use and Privacy Policy
              </label>

              <div className="mt-4">
                <button
                  onClick={handlePay}
                  className="bg-green-600 text-white px-5 py-3 rounded"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <aside className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Order summary</h3>

          <div className="flex items-center gap-4">
            <img
              src={tutor.image || "/mnt/data/Screenshot 2025-11-20 190636.png"}
              alt={tutor.name}
              className="w-24 h-20 object-cover rounded"
            />
            <div>
              <div className="font-semibold">{tutor.name}</div>
              <div className="text-sm text-gray-500">{tutor.subject}</div>
            </div>
          </div>

          <div className="mt-6 border-t pt-4 text-sm text-gray-600">
            <div className="flex justify-between py-2">
              <span>Original Price:</span>
              <span className="line-through">₹{(tutor.price * 10) || 10000}</span>
            </div>

            <div className="flex justify-between py-2">
              <span>Discounts:</span>
              <span>-₹{(tutor.price * 9) || 9000}</span>
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
