// src/components/ReviewForm.jsx
import React, { useState } from "react";
import axios from "axios";

const API = "https://lms-back-nh5h.onrender.com";

const ReviewForm = ({ tutorId, recordingOptions = [], onSaved }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [recordingId, setRecordingId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) return alert("Please provide rating and comment");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API}/api/reviews`,
        {
          tutorId,
          rating,
          comment,
          recordingId: recordingId || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComment("");
      setRating(5);
      setRecordingId("");

      onSaved && onSaved(res.data);

    } catch (err) {
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md border mt-4 font-jakarta"
    >
      <h4 className="font-bold text-gray-800 mb-3 text-lg">Write a Review</h4>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 w-full rounded-xl mt-1 focus:ring-2 focus:ring-purple-300"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ★
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full border p-3 rounded-xl mt-1 focus:ring-2 focus:ring-purple-300"
        />
      </div>

      {recordingOptions.length > 0 && (
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Attach to Recording (optional)
          </label>
          <select
            value={recordingId}
            onChange={(e) => setRecordingId(e.target.value)}
            className="w-full border p-2 rounded-xl mt-1 focus:ring-2 focus:ring-purple-300"
          >
            <option value="">— None —</option>
            {recordingOptions.map((r) => (
              <option key={r._id} value={r._id}>
                {r.originalFileName}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-xl shadow hover:opacity-95"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
