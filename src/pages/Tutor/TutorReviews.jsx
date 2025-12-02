// src/pages/TutorReviews.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://lms-back-nh5h.onrender.com";

const TutorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/reviews/tutor/me`);
      const list = res.data?.reviews || res.data || [];
      setReviews(list);

      if (list.length > 0) {
        const avgRating = list.reduce((a, b) => a + (b.rating || 0), 0) / list.length;
        setAvg((avgRating || 0).toFixed(1));
      } else {
        setAvg(0);
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
      setReviews([]);
      setAvg(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="p-6 font-jakarta bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-purple-700">Student Reviews</h2>
          <div className="text-right">
            <div className="text-sm text-gray-500">Average Rating</div>
            <div className="text-2xl font-bold text-yellow-600">{avg} ★</div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl p-4 shadow border">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{r.student?.name || "Student"}</div>
                    <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
                  </div>

                  <div className="text-sm text-yellow-600 font-semibold">{r.rating} ★</div>
                </div>

                <p className="mt-3 text-gray-700">{r.comment}</p>

                {r.recording?.originalFileName && (
                  <div className="text-xs text-gray-500 mt-3">Recording: {r.recording.originalFileName}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorReviews;
