// src/pages/Tutor/TutorDashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import {
  FiLogOut,
  FiClock,
  FiVideo,
  FiCreditCard,
  FiStar,
  FiUser,
} from "react-icons/fi";

const TutorDashboard = () => {
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showSetup, setShowSetup] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [recordings, setRecordings] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  /* ===============================
        LOAD USER DETAILS
  =============================== */
  const loadTutor = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/profile",
        authHeader
      );
      setTutor(res.data);
    } catch (err) {
      console.error("Tutor profile load error:", err);
    }
  };

  /* ===============================
       LOAD TUTOR PROFILE
  =============================== */
  const loadTutorProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/tutors/profile/me",
        authHeader
      );

      setProfile(res.data);

      if (!res.data || !res.data.bio || res.data.subjects?.length === 0) {
        setShowSetup(true);
      }
    } catch (err) {
      console.error("Tutor profile fetch failed:", err);
    }
  };

  /* ===============================
       LOAD STATS (BOOKINGS, ETC)
  =============================== */
  const fetchStats = async () => {
    try {
      setLoading(true);

      const [b, p, r] = await Promise.all([
        axios.get("http://localhost:5000/api/bookings/tutor", authHeader),
        axios.get("http://localhost:5000/api/payments/tutor", authHeader),
        axios.get("http://localhost:5000/api/recordings/tutor", authHeader),
      ]);

      setBookings(b.data || []);
      setPayments(p.data || []);
      setRecordings(r.data || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
       LOAD REVIEWS
  =============================== */
  const loadReviews = async () => {
    try {
      setLoadingReviews(true);

      const tutorUserId = profile?.user || tutor?._id;

      if (!tutorUserId) {
        setReviews([]);
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/reviews/tutor/${tutorUserId}`
      );

      setReviews(res.data?.reviews || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  /* ===============================
       INITIAL LOAD
  =============================== */
  useEffect(() => {
    loadTutor();
    loadTutorProfile();
    fetchStats();
  }, []);

  useEffect(() => {
    if (profile || tutor) loadReviews();
    // eslint-disable-next-line
  }, [profile, tutor]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* ==========================
            PROFILE SETUP POPUP
      =========================== */}
      {showSetup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-600">
              Complete Your Tutor Profile
            </h2>
            <p className="text-sm text-gray-600">
              Please complete your profile from the profile setup page.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowSetup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================
              SIDEBAR
      =========================== */}
      <aside className="w-64 bg-white shadow-xl border-r flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Tutor Panel</h1>

          <button
            className="text-gray-500 hover:text-red-500"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            <FiLogOut size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate("/dashboard/tutor")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100 transition font-medium"
          >
            <FiUser /> Overview
          </button>

          <button
            onClick={() => navigate("/dashboard/tutor/availability")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100 transition font-medium"
          >
            <FiClock /> Availability
          </button>

          <button
            onClick={() => navigate("/dashboard/tutor/bookings")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100 transition font-medium"
          >
            <FiClock /> Bookings
          </button>

          <button
            onClick={() => navigate("/dashboard/tutor/payments")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100 transition font-medium"
          >
            <FiCreditCard /> Payments
          </button>

          <button
            onClick={() => navigate("/dashboard/tutor/recordings")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100 transition font-medium"
          >
            <FiVideo /> Recordings
          </button>

          <button
            onClick={() => navigate("/dashboard/tutor/reviews")}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100 transition font-medium"
          >
            <FiStar /> Reviews
          </button>

          <button
            onClick={() => navigate("/dashboard/tutor/setup")}
            className="flex items-center gap-3 w-full p-3 rounded-lg transition text-gray-700 hover:bg-purple-100"
          >
            📝 Profile Setup
          </button>
        </nav>
      </aside>

      {/* ==========================
                MAIN
      =========================== */}
      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-3xl font-extrabold mb-8">
          Welcome,{" "}
          <span className="text-blue-600">{tutor?.name || "Tutor"}</span>
        </h2>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 shadow-lg rounded-2xl border">
            <p className="text-sm text-gray-500">Total Students Booked</p>
            <p className="text-3xl font-bold mt-2">{bookings.length}</p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-2xl border">
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ₹{payments.reduce((t, p) => t + (p.amount || 0), 0)}
            </p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-2xl border">
            <p className="text-sm text-gray-500">Recordings Uploaded</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {recordings.length}
            </p>
          </div>
        </div>

        {/* ==========================
               REVIEWS
        =========================== */}
        <section className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Reviews</h3>

          {loadingReviews ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="border p-3 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {r.student?.name || "Student"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-sm text-yellow-600 font-semibold">
                      {r.rating} ★
                    </div>
                  </div>

                  <p className="mt-2 text-sm">{r.comment}</p>

                  {r.recording?.originalFileName && (
                    <div className="text-xs text-gray-500 mt-2">
                      Recording: {r.recording.originalFileName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {loading ? <p>Loading...</p> : <Outlet />}
      </main>
    </div>
  );
};

export default TutorDashboard;
