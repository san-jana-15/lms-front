// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentSidebar from "../components/StudentSidebar";
import PaymentButton from "../components/paymentButton";
import BookingModal from "../components/BookingModal";
import ReviewForm from "../components/ReviewForm";

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [paidIds, setPaidIds] = useState(new Set());
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  const [showRateModal, setShowRateModal] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadProfile();
    loadTutors();
    loadPurchasedRecordings();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://lms-back-nh5h.onrender.com/api/auth/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
    } catch (err) {}
  };

  const loadTutors = async () => {
    try {
      const res = await axios.get("https://lms-back-nh5h.onrender.com/api/tutors");
      setTutors(res.data || []);
    } catch (err) {}
  };

  const loadPurchasedRecordings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://lms-back-nh5h.onrender.com/api/payments/student",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const purchasedIds = (res.data || [])
        .map((p) => (p.recording ? String(p.recording?._id || p.recording) : null))
        .filter(Boolean);

      setPaidIds(new Set(purchasedIds));
    } catch (err) {}
  };

  const loadTutorRecordings = async (tutor) => {
    if (!tutor?.userId) return setRecordings([]);
    try {
      const res = await axios.get(
        `https://lms-back-nh5h.onrender.com/api/recordings?tutorId=${tutor.userId}`
      );
      setRecordings(res.data || []);
    } catch {
      setRecordings([]);
    }
  };

  const tutorRecordings = selectedTutor
    ? recordings.filter(
        (rec) =>
          String(rec.tutor?._id || rec.tutor) === String(selectedTutor.userId)
      )
    : [];

  const handlePaid = (recId) =>
    setPaidIds((prev) => new Set([...prev, String(recId)]));

  const filteredTutors = tutors.filter((t) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (t.name || "").toLowerCase().includes(q) ||
      (t.subjects || []).join(" ").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta overflow-hidden">
      <StudentSidebar />

      {/* MAIN AREA */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 drop-shadow-sm">
          Welcome, {user?.name || "Student"}
        </h1>

        {/* ===================== TUTORS LIST ===================== */}
        {!selectedTutor && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Available Tutors</h2>

              <input
                className="px-4 py-2 rounded-xl border shadow-sm bg-white focus:ring-2 focus:ring-purple-300 w-80"
                placeholder="Search tutors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {filteredTutors.length === 0 ? (
              <p className="text-gray-600">No tutors found.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTutors.map((tutor) => (
                  <div
                    key={tutor._id}
                    onClick={() => {
                      setSelectedTutor(tutor);
                      loadTutorRecordings(tutor);
                    }}
                    className="p-6 bg-white rounded-2xl shadow-md border hover:shadow-xl transition cursor-pointer hover:scale-[1.02]"
                  >
                    <h3 className="text-xl font-extrabold text-purple-700 mb-1">
                      {tutor.name}
                    </h3>

                    {tutor.headline && (
                      <p className="text-sm text-gray-600 mb-2">{tutor.headline}</p>
                    )}

                    <p className="text-sm text-gray-500">
                      Subjects:{" "}
                      <span className="font-semibold">
                        {tutor.subjects?.join(", ")}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ===================== TUTOR DETAIL ===================== */}
        {selectedTutor && (
          <>
            <button
              className="mb-6 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition text-sm shadow"
              onClick={() => setSelectedTutor(null)}
            >
              ← Back to Tutors
            </button>

            <div className="bg-white rounded-2xl shadow-lg border p-8 mb-8">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-purple-700 mb-1">
                    {selectedTutor.name}
                  </h2>
                  <p className="text-gray-600">{selectedTutor.headline}</p>

                  <p className="mt-2 text-gray-500">
                    Subjects:{" "}
                    <span className="font-semibold">
                      {selectedTutor.subjects?.join(", ")}
                    </span>
                  </p>

                  <p className="text-gray-500">
                    Hourly Rate:{" "}
                    <span className="font-bold text-purple-700">
                      ₹{selectedTutor.hourlyRate}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowBooking(true)}
                    className="px-5 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow hover:opacity-90"
                  >
                    Book This Tutor
                  </button>

                  <button
                    onClick={() => setShowRateModal(true)}
                    className="px-5 py-2 border rounded-xl shadow bg-white hover:bg-gray-50"
                  >
                    Rate Tutor
                  </button>
                </div>
              </div>

              <p className="mt-4 text-gray-700">{selectedTutor.bio}</p>
            </div>

            {/* Booking Modal */}
            {showBooking && (
              <BookingModal
                tutor={selectedTutor}
                onClose={() => setShowBooking(false)}
              />
            )}

            {/* Rating Modal */}
            {showRateModal && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
                  <h3 className="text-xl font-bold mb-3">
                    Rate {selectedTutor.name}
                  </h3>

                  <ReviewForm
                    tutorId={selectedTutor.userId || selectedTutor._id}
                    recordingOptions={[]}
                    onSaved={() => {
                      alert("Thanks for the rating!");
                      setShowRateModal(false);
                    }}
                  />

                  <button
                    className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                    onClick={() => setShowRateModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* ===================== RECORDINGS ===================== */}
            <h3 className="text-2xl font-extrabold text-gray-800 mb-4">
              Recordings by {selectedTutor.name}
            </h3>

            {tutorRecordings.length === 0 ? (
              <p className="text-gray-600">
                This tutor has not uploaded any recordings yet.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tutorRecordings.map((rec) => {
                  const isPaid = paidIds.has(String(rec._id));

                  return (
                    <div
                      key={rec._id}
                      className="p-6 bg-white rounded-2xl shadow-md border"
                    >
                      <div className="h-40 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl mb-4 flex items-center justify-center text-white font-medium shadow-inner">
                        {isPaid ? "Purchased Recording" : "Locked Recording"}
                      </div>

                      <h4 className="font-bold text-lg mb-1">
                        {rec.originalFileName}
                      </h4>

                      <p className="text-sm text-gray-500 mb-1">
                        {rec.description}
                      </p>

                      <p className="text-xs text-gray-500 mb-3">
                        Subject:{" "}
                        <span className="font-medium">{rec.subject}</span>
                      </p>

                      {isPaid ? (
                        <p className="text-green-600 font-semibold text-sm">
                          ✔ Purchased — watch in My Recordings
                        </p>
                      ) : (
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-xl font-bold text-green-600">
                            ₹{rec.price}
                          </p>

                          <PaymentButton
                            recordingId={rec._id}
                            amount={rec.price}
                            tutorId={selectedTutor.userId}
                            onPaid={() => handlePaid(rec._id)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
