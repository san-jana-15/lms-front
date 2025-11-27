import React, { useEffect, useState } from "react";
import axios from "../../axiosClient";
import ReviewList from "../../components/ReviewList";

const TutorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      const res = await axios.get("/reviews/tutor/me");
      const list = res.data;

      setReviews(list);

      if (list.length > 0) {
        const avgRating = list.reduce((a, b) => a + b.rating, 0) / list.length;
        setAvg(avgRating.toFixed(1));
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Student Reviews</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReviewList reviews={reviews} count={reviews.length} average={avg} />
      )}
    </div>
  );
};

export default TutorReviews;
