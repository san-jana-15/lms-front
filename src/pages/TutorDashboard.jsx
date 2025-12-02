// src/pages/TutorDashboard.jsx
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

const API = "https://lms-back-nh5h.onrender.com";

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
      const res = await axios.get(`${API}/api/auth/profile`, authHeader);
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
      const res = await axios.get(`${API}/api/tutors/profile/me`, authHeader);
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
        axios.get(`${API}/api/bookings/tutor`, authHeader),
        axios.get(`${API}/api/payments/tutor`, authHeader),
        axios.get(`${API}/api/recordings/tutor`, authHeader),
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

      const res = await axios.get(`${API}/api/reviews/tutor/${tutorUserId}`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profile || tutor) loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, tutor]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta text-gray-800">
      {/* SETUP POPUP */}
      {showSetup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100">
            <h2 className="text-xl font-semibold text-purple-700 mb-2">
              Complete Your Tutor Profile
            </h2>
            <p className="text-sm text-gray-600">
              You appear to have an incomplete profile — please finish your profile setup to attract more students.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
                onClick={() => setShowSetup(false)}
              >
                Dismiss
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                onClick={() => {
                  setShowSetup(false);
                  navigate("/dashboard/tutor/setup");
                }}
              >
                Go to Setup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-72 bg-white shadow-xl border-r flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-purple-700">Tutor Panel</h1>
            <div className="text-xs text-gray-500 mt-1">Manage your classes & earnings</div>
          </div>

          <button
            className="text-gray-500 hover:text-red-500"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => navigate("/dashboard/tutor")} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-50/60 transition text-sm">
            <FiUser /> <span>Overview</span>
          </button>

          <button onClick={() => navigate("/dashboard/tutor/availability")} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-50/60 transition text-sm">
            <FiClock /> <span>Availability</span>
          </button>

          <button onClick={() => navigate("/dashboard/tutor/bookings")} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-50/60 transition text-sm">
            <FiClock /> <span>Bookings</span>
          </button>

          <button onClick={() => navigate("/dashboard/tutor/payments")} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-50/60 transition text-sm">
            <FiCreditCard /> <span>Payments</span>
          </button>

          <button onClick={() => navigate("/dashboard/tutor/recordings")} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-50/60 transition text-sm">
            <FiVideo /> <span>Recordings</span>
          </button>

          <button onClick={() => navigate("/dashboard/tutor/reviews")} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-50/60 transition text-sm">
            <FiStar /> <span>Reviews</span>
          </button>

          <button onClick={() => navigate("/dashboard/tutor/setup")} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-purple-100 text-sm mt-4">
            <span>📝</span> <span>Profile Setup</span>
          </button>
        </nav>

        <div className="p-4 border-t">
          <div className="text-xs text-gray-500">Logged in as</div>
          <div className="text-sm font-medium text-gray-700">{tutor?.name || "Tutor"}</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-3xl font-extrabold mb-6">
          Welcome, <span className="text-purple-700">{tutor?.name || "Tutor"}</span>
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
            <p className="text-3xl font-bold text-blue-600 mt-2">{recordings.length}</p>
          </div>
        </div>

        {/* REVIEWS */}
        <section className="bg-white p-6 rounded-2xl shadow mb-8 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Reviews</h3>
            <div className="text-sm text-gray-500">{loadingReviews ? "Loading..." : `${reviews.length} review(s)`}</div>
          </div>

          {loadingReviews ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="border rounded-xl p-4 bg-white/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.student?.name || "Student"}</div>
                      <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="text-sm text-yellow-600 font-semibold">{r.rating} ★</div>
                  </div>

                  <p className="mt-2 text-sm text-gray-700">{r.comment}</p>

                  {r.recording?.originalFileName && (
                    <div className="text-xs text-gray-500 mt-2">Recording: {r.recording.originalFileName}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Outlet for nested tutor pages */}
        <div className="bg-white rounded-2xl p-6 shadow border">
          {loading ? <p className="text-gray-500">Loading dashboard...</p> : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default TutorDashboard;
