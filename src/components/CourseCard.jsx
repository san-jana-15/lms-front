// components/CourseCard.jsx
import React from "react";

export default function CourseCard({ tutor, onClick }) {
  const fallbackImages = [
    "/mnt/data/Screenshot 2025-11-20 190636.png",
    "/mnt/data/Screenshot 2025-11-20 190651.png",
    "/mnt/data/Screenshot 2025-11-20 190711.png",
  ];

  const img = tutor.image || fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition overflow-hidden font-jakarta"
    >
      {/* Image */}
      <div className="h-56 w-full overflow-hidden">
        <img
          src={img}
          alt={tutor.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800">{tutor.name}</h3>
        <p className="text-sm text-gray-600">{tutor.subject}</p>

        <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
          <span className="flex items-center gap-1 px-2 py-1 border rounded-full">
            ⭐ {tutor.rating ?? "4.5"}
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {tutor.ratingsCount ?? "3.7K"} ratings
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded-full">
            {tutor.hours ?? "28.4"} hrs
          </span>
        </div>

        <div className="flex gap-3 mt-5">
          <button className="flex-1 bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700">
            View
          </button>

          <button className="w-28 border border-gray-200 py-2 rounded-xl hover:bg-gray-50">
            ₹{tutor.price ?? 0}
          </button>
        </div>
      </div>
    </div>
  );
}
