// src/components/ReviewList.jsx
import React from "react";

const ReviewList = ({ reviews = [], average = 0, count = 0 }) => {
  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold">Reviews</h4>
          <p className="text-sm text-gray-600">{count} review(s) — avg {average} ★</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map(r => (
            <li key={r._id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.student?.name || "Student"}</div>
                <div className="text-sm text-yellow-600">{r.rating} ★</div>
              </div>

              {r.comment && <p className="text-sm mt-2">{r.comment}</p>}

              {r.recording?.originalFileName && (
                <p className="text-xs text-gray-500 mt-2">Recording: {r.recording.originalFileName}</p>
              )}

              {r.reply && <p className="text-xs text-blue-700 mt-2">Tutor Reply: {r.reply}</p>}

              <div className="text-xs text-gray-400 mt-2">{new Date(r.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;
