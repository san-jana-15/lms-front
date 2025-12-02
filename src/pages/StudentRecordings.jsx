// src/pages/StudentRecordings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentSidebar from "../components/StudentSidebar";
import PaymentButton from "../components/paymentButton";
import StudentReviewModal from "../components/StudentReviewModal";

const StudentRecordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [paidIds, setPaidIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRecordingId, setReviewRecordingId] = useState(null);
  const [reviewTutorId, setReviewTutorId] = useState(null);

  const API = "https://lms-back-nh5h.onrender.com";

  const loadRecordings = async () => {
    try {
      const token = localStorage.getItem("token");

      const [recRes, payRes] = await Promise.all([
        axios.get(`${API}/api/recordings`),
        axios.get(`${API}/api/payments/student`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      setRecordings(recRes.data || []);

      const purchasedIds = (payRes.data || [])
        .map((p) => p.recording?._id)
        .filter(Boolean);

      setPaidIds(new Set(purchasedIds));
    } catch (err) {
      console.error("Error loading recordings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  const handlePlay = async (rec) => {
    if (!paidIds.has(rec._id)) return alert("Please purchase this recording first.");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/recordings/${rec._id}/url`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedVideo({ url: `${API}${res.data.url}`, id: rec._id });
    } catch {
      alert("Video could not be loaded.");
    }
  };

  const handleVideoEnded = (rec) => {
    const key = `reviewed_${rec._id}`;
    if (localStorage.getItem(key)) return;

    setReviewRecordingId(rec._id);
    setReviewTutorId(rec.tutor?._id);
    setShowReviewModal(true);
  };

  if (loading)
    return (
      <p className="text-center mt-10 font-jakarta text-gray-600 text-lg">
        Loading...
      </p>
    );

  const purchased = recordings.filter((r) => paidIds.has(r._id));
  const available = recordings.filter((r) => !paidIds.has(r._id));

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta">
      <StudentSidebar />

      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          My Recordings
        </h1>

        {/* PURCHASED */}
        <h2 className="text-2xl font-bold mb-4 text-green-700">Purchased</h2>

        {purchased.length === 0 ? (
          <p className="text-gray-600 mb-10">
            You haven't purchased any recordings yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {purchased.map((rec) => (
              <div
                key={rec._id}
                className="bg-white shadow-lg rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition"
              >
                <video
                  src={`${API}${rec.filePath}`}
                  className="w-full h-44 rounded-xl mb-4 object-cover cursor-pointer shadow"
                  onClick={() => handlePlay(rec)}
                />

                <h3 className="text-lg font-bold">{rec.originalFileName}</h3>
                <p className="text-sm text-gray-500">{rec.description}</p>

                <p className="mt-2 text-sm">
                  Tutor: <strong>{rec.tutor?.name}</strong>
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handlePlay(rec)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
                  >
                    Play
                  </button>

                  <button
                    onClick={() => {
                      setReviewRecordingId(rec._id);
                      setReviewTutorId(rec.tutor?._id);
                      setShowReviewModal(true);
                    }}
                    className="px-4 py-2 border rounded-xl shadow hover:bg-gray-50"
                  >
                    Rate Tutor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AVAILABLE */}
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Available to Buy</h2>

        {available.length === 0 ? (
          <p className="text-gray-600">No recordings available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {available.map((rec) => (
              <div
                key={rec._id}
                className="bg-white shadow-lg rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition"
              >
                <div className="w-full h-44 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl mb-4"></div>

                <h3 className="text-lg font-bold">{rec.originalFileName}</h3>
                <p className="text-sm text-gray-500">{rec.description}</p>
                <p className="mt-2 text-sm">
                  Tutor: <strong>{rec.tutor?.name}</strong>
                </p>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold text-green-600">₹{rec.price}</p>

                  <PaymentButton
                    recordingId={rec._id}
                    amount={rec.price}
                    tutorId={rec.tutor?._id}
                    onPaid={() =>
                      setPaidIds((prev) => new Set([...prev, rec._id]))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIDEO PLAYER MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 max-w-3xl w-full relative shadow-2xl">
            <button
              className="absolute top-3 right-3 text-2xl font-bold hover:text-red-500"
              onClick={() => setSelectedVideo(null)}
            >
              ✕
            </button>

            <video
              controls
              autoPlay
              src={selectedVideo.url}
              className="w-full rounded-xl shadow"
              onEnded={() => {
                const rec = recordings.find((r) => r._id === selectedVideo.id);
                if (rec) handleVideoEnded(rec);
              }}
            />
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <StudentReviewModal
          recordingId={reviewRecordingId}
          tutorId={reviewTutorId}
          onClose={() => setShowReviewModal(false)}
          onSaved={() => {
            localStorage.setItem(`reviewed_${reviewRecordingId}`, "1");
            setShowReviewModal(false);
          }}
        />
      )}
    </div>
  );
};

export default StudentRecordings;
