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
          recordingId: recordingId || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComment("");
      setRating(5);
      setRecordingId("");

      if (onSaved) onSaved(res.data);
    } catch (err) {
      console.error("Review submit error:", err);
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mt-4">
      <h4 className="font-semibold mb-2">Write a Review</h4>

      <div className="flex items-center gap-3 mb-2">
        <label className="text-sm">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border p-1 rounded">
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
        </select>
      </div>

      <div className="mb-2">
        <label className="text-sm">Comment</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border p-2 rounded mt-1" rows={3} required/>
      </div>

      {recordingOptions.length > 0 && (
        <div className="mb-2">
          <label className="text-sm">Attach to recording (optional)</label>
          <select value={recordingId} onChange={e => setRecordingId(e.target.value)} className="w-full border p-2 rounded mt-1">
            <option value="">— None —</option>
            {recordingOptions.map(r => <option key={r._id} value={r._id}>{r.originalFileName}</option>)}
          </select>
        </div>
      )}

      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
