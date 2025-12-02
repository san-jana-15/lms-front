// src/components/ReviewList.jsx
import React from "react";

const ReviewList = ({ reviews = [], average = 0, count = 0 }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border mt-4 font-jakarta">

      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-gray-800 text-lg">Reviews</h4>
          <p className="text-sm text-gray-600">
            {count} review(s) • Avg {average} ⭐
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-600 italic">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li
              key={r._id}
              className="border rounded-2xl p-4 bg-gray-50 hover:bg-gray-100 transition shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-800">
                  {r.student?.name || "Student"}
                </div>
                <div className="text-yellow-600 font-semibold">{r.rating} ⭐</div>
              </div>

              {r.comment && (
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">{r.comment}</p>
              )}

              {r.recording?.originalFileName && (
                <p className="text-xs text-gray-500 mt-2">
                  Recording: {r.recording.originalFileName}
                </p>
              )}

              {r.reply && (
                <p className="text-xs text-blue-700 mt-2 font-medium">
                  Tutor Reply: {r.reply}
                </p>
              )}

              <div className="text-xs text-gray-400 mt-2">
                {new Date(r.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;
