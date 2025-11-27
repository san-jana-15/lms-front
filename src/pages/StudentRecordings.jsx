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
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

  // REVIEW MODAL
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRecordingId, setReviewRecordingId] = useState(null);
  const [reviewTutorId, setReviewTutorId] = useState(null);

  const loadRecordings = async () => {
    try {
      const token = localStorage.getItem("token");

      const [recRes, payRes] = await Promise.all([
        axios.get("http://localhost:5000/api/recordings"),
        axios.get("http://localhost:5000/api/payments/student", {
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

  // PLAY RECORDING (with review check)
  const handlePlay = async (rec) => {
    // check purchased client-side (we already fetched student's payments)
    if (!paidIds.has(rec._id)) {
      alert("You must purchase this recording to watch it.");
      return;
    }

    // Show the video directly; the review check will be prompted at 'ended' event
    const url = `http://localhost:5000/${rec.filePath.replace(/\\/g, "/")}`;
    setSelectedVideoUrl(url);
  };

  // When video ends, show review modal if not reviewed before for this student/recording.
  // We'll track per-recording first-time-review in localStorage to avoid repeated prompts.
  const handleVideoEnded = (rec) => {
    const key = `reviewed_${rec._id}`;
    if (localStorage.getItem(key)) {
      return; // already reviewed before on this browser
    }
    // open modal to submit review first time
    setReviewRecordingId(rec._id);
    setReviewTutorId(rec.tutor?._id);
    setShowReviewModal(true);
  };

  if (loading) return <p className="mt-10 text-center">Loading...</p>;

  const purchased = recordings.filter(r => paidIds.has(r._id));
  const available = recordings.filter(r => !paidIds.has(r._id));

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">My Recordings</h1>

        {/* PURCHASED */}
        <h2 className="text-2xl font-semibold mb-4 text-green-700">Purchased</h2>

        {purchased.length === 0 ? (
          <p className="text-gray-600 mb-10">You haven't purchased any recordings.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {purchased.map((rec) => (
              <div key={rec._id} className="bg-white shadow rounded-xl p-5">
                <video
                  src={`http://localhost:5000/${rec.filePath.replace(/\\/g, "/")}`}
                  onClick={() => handlePlay(rec)}
                  className="w-full h-40 rounded-lg mb-3 cursor-pointer"
                  controls={false}
                />

                <h3 className="text-lg font-semibold">{rec.originalFileName}</h3>
                <p className="text-sm text-gray-500">{rec.description}</p>
                <p className="text-sm mt-2">
                  Tutor: <strong>{rec.tutor?.name}</strong>
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handlePlay(rec)}
                    className="px-3 py-2 bg-blue-600 text-white rounded"
                  >
                    Play
                  </button>

                  <button
                    onClick={() => {
                      // allow student to rate tutor manually here as well
                      setReviewRecordingId(rec._id);
                      setReviewTutorId(rec.tutor?._id);
                      setShowReviewModal(true);
                    }}
                    className="px-3 py-2 border rounded"
                  >
                    Rate Tutor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AVAILABLE */}
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">Available to Buy</h2>

        {available.length === 0 ? (
          <p className="text-gray-600">No recordings available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {available.map((rec) => (
              <div key={rec._id} className="bg-white shadow rounded-xl p-5">

                <div className="relative w-full h-40 bg-black rounded-lg overflow-hidden mb-3" />

                <h3 className="text-lg font-semibold">{rec.originalFileName}</h3>
                <p className="text-sm text-gray-500">{rec.description}</p>
                <p className="text-sm mt-2">
                  Tutor: <strong>{rec.tutor?.name}</strong>
                </p>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-lg font-bold text-green-600">₹{rec.price}</p>

                  <PaymentButton
                    recordingId={rec._id}
                    amount={rec.price}
                    tutorId={rec.tutor?._id}
                    onPaid={() => {
                      setPaidIds((prev) => new Set([...prev, rec._id]));
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIDEO PLAYER MODAL */}
      {selectedVideoUrl && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 max-w-3xl w-full relative">
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => setSelectedVideoUrl(null)}
            >
              ✖
            </button>

            {/* video element with onEnded -> show review modal */}
            <video
              controls
              autoPlay
              src={selectedVideoUrl}
              className="w-full rounded-lg"
              onEnded={() => {
                // find recording object from URL
                const rec = recordings.find(r => selectedVideoUrl.includes(r._id) || selectedVideoUrl.includes(r.originalFileName));
                // fallback: use last played
                if (rec) {
                  handleVideoEnded(rec);
                } else {
                  // if cannot find rec by URL, find by filePath
                  const rec2 = recordings.find(r => selectedVideoUrl.endsWith(r.filePath.replace(/\\/g, "/")));
                  if (rec2) handleVideoEnded(rec2);
                }
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
            // mark as reviewed locally so we only ask once
            if (reviewRecordingId) {
              localStorage.setItem(`reviewed_${reviewRecordingId}`, "1");
            }
            setShowReviewModal(false);
          }}
        />
      )}
    </div>
  );
};

export default StudentRecordings;
