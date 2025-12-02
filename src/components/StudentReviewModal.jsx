// src/components/StudentReviewModal.jsx
import React, { useState } from "react";
import axios from "axios";

const API = "https://lms-back-nh5h.onrender.com";

const StudentReviewModal = ({ recordingId, tutorId, onClose, onSaved }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    if (!rating || !comment) return alert("Please add comment and rating");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/api/reviews`,
        { tutorId, rating, comment, recordingId: recordingId || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Review submitted!");
      onSaved && onSaved();
    } catch (err) {
      alert("Failed to submit review");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl border font-jakarta">

        <h2 className="text-xl font-extrabold text-purple-700 text-center mb-5">
          ⭐ Rate Your Experience
        </h2>

        {/* Rating */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Rating</span>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border p-2 rounded-xl mt-1 focus:ring-2 focus:ring-purple-300"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} ⭐
              </option>
            ))}
          </select>
        </label>

        {/* Comment */}
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Comment</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-3 rounded-xl mt-1 focus:ring-2 focus:ring-purple-300"
            rows="3"
            placeholder="Share something helpful..."
          />
        </label>

        <div className="flex gap-3 mt-6">
          <button
            onClick={submitReview}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-xl shadow hover:opacity-95"
          >
            Submit
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-xl hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentReviewModal;
