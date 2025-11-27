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

  // review UI
  const [showRateModal, setShowRateModal] = useState(false);

  // search
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadProfile();
    loadTutors();
    loadPurchasedRecordings();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Profile load error:", err);
    }
  };

  const loadTutors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tutors");
      setTutors(res.data || []);
    } catch (err) {
      console.error("Tutors load error:", err);
    }
  };

  const loadPurchasedRecordings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/payments/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const purchasedIds = (res.data || [])
        .map((p) => (p.recording ? String(p.recording?._id || p.recording) : null))
        .filter(Boolean);
      setPaidIds(new Set(purchasedIds));
    } catch (err) {
      console.error("Paid load error:", err);
    }
  };

  const loadTutorRecordings = async (tutor) => {
    if (!tutor?.userId) {
      setRecordings([]);
      return;
    }
    const tutorUserId = tutor.userId;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/recordings?tutorId=${tutorUserId}`
      );
      setRecordings(res.data || []);
    } catch (err) {
      console.error("Error loading tutor recordings:", err);
      setRecordings([]);
    }
  };

  const tutorRecordings = selectedTutor
    ? recordings.filter(
        rec => String(rec.tutor?._id || rec.tutor) === String(selectedTutor.userId)
      )
    : [];

  const handlePaid = (recId) =>
    setPaidIds((prev) => new Set([...Array.from(prev), String(recId)]));

  // search filter
  const filteredTutors = tutors.filter(t => {
    if (!query) return true;
    const q = query.toLowerCase();
    const byName = (t.name || "").toLowerCase().includes(q);
    const bySubjects = (t.subjects || []).join(" ").toLowerCase().includes(q);
    return byName || bySubjects;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">
          Welcome {user?.name || "Student"}
        </h1>

        {!selectedTutor && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Available Tutors</h2>
              <input
                className="border p-2 rounded w-80"
                placeholder="Search tutors by name or subject..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {filteredTutors.length === 0 ? (
              <p className="text-gray-600">No tutors found.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutors.map((tutor) => (
                  <div
                    key={tutor.profileId || tutor.userId || tutor._id}
                    className="bg-white shadow rounded-xl p-5 hover:shadow-lg cursor-pointer transition"
                    onClick={() => {
                      setSelectedTutor(tutor);
                      loadTutorRecordings(tutor);
                    }}
                  >
                    <h3 className="text-xl font-semibold mb-1">{tutor.name}</h3>

                    {tutor.headline && (
                      <p className="text-sm text-gray-600 mb-2">{tutor.headline}</p>
                    )}

                    {tutor.subjects?.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Subjects: <span className="font-medium">{tutor.subjects.join(", ")}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {selectedTutor && (
          <div>
            <button
              className="mb-4 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
              onClick={() => setSelectedTutor(null)}
            >
              ← Back to Tutors
            </button>

            <div className="bg-white shadow rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedTutor.name}</h2>
                  <p className="text-gray-600 mb-1">{selectedTutor.headline}</p>
                  <p className="text-sm text-gray-500">
                    Subjects: <span className="font-medium">{selectedTutor.subjects?.join(", ")}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Hourly Rate: <span className="font-semibold">₹{selectedTutor.hourlyRate}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowBooking(true)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                  >
                    Book this Tutor
                  </button>

                  <button
                    onClick={() => setShowRateModal(true)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
                  >
                    Rate Tutor
                  </button>
                </div>
              </div>

              <p className="text-gray-700 text-sm">{selectedTutor.bio}</p>
            </div>

            {showBooking && <BookingModal tutor={selectedTutor} onClose={() => setShowBooking(false)} />}

            {showRateModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow max-w-lg w-full">
                  <h3 className="text-xl font-semibold mb-3">Rate {selectedTutor.name}</h3>
                  <ReviewForm
                    tutorId={selectedTutor.userId || selectedTutor._id}
                    recordingOptions={[]}
                    onSaved={() => {
                      alert("Thanks for the rating!");
                      setShowRateModal(false);
                    }}
                  />
                  <button className="mt-3 text-sm text-gray-500" onClick={() => setShowRateModal(false)}>Close</button>
                </div>
              </div>
            )}

            <h3 className="text-xl font-semibold mb-3">Recordings by {selectedTutor.name}</h3>

            {tutorRecordings.length === 0 ? (
              <p className="text-gray-600">This tutor has not uploaded any recordings yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorRecordings.map((rec) => {
                  const isPaid = paidIds.has(String(rec._id));
                  return (
                    <div key={rec._id} className="bg-white shadow rounded-xl p-5">
                      <div className="w-full h-40 bg-black/80 rounded-lg mb-3 flex items-center justify-center text-white text-sm">
                        {isPaid ? "Purchased Recording" : "Locked Recording"}
                      </div>

                      <h4 className="font-semibold text-lg mb-1">{rec.originalFileName}</h4>

                      {rec.description && <p className="text-sm text-gray-500 mb-1">{rec.description}</p>}

                      <p className="text-xs text-gray-500 mb-1">
                        Subject: <span className="font-medium">{rec.subject}</span>
                      </p>

                      {isPaid ? (
                        <p className="mt-3 text-green-600 font-semibold text-sm">✔ Purchased — watch it in My Recordings</p>
                      ) : (
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-lg font-bold text-green-600">₹{rec.price}</p>

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
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
