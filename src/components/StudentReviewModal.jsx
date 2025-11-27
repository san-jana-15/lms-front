// src/components/StudentReviewModal.jsx
import React, { useState } from "react";
import axios from "axios";

const StudentReviewModal = ({ recordingId, tutorId, onClose, onSaved }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    if (!rating || !comment) return alert("Please add comment and rating");
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          tutorId,
          rating,
          comment,
          recordingId: recordingId || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Review submitted!");
      if (onSaved) onSaved();
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-purple-600 text-center">
          Rate this Recording
        </h2>

        <label className="block mb-4">
          <span className="text-gray-700">Rating (1 to 5)</span>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border p-2 rounded mt-1"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} ⭐</option>
            ))}
          </select>
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Comment</span>
          <textarea
            className="w-full border p-2 rounded mt-1"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>

        <div className="flex gap-3">
          <button
            onClick={submitReview}
            className="flex-1 bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700"
          >
            Submit
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-400 text-white rounded-lg py-2 hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentReviewModal;
