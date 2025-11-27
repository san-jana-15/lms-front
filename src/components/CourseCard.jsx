// components/CourseCard.jsx
import React from "react";

export default function CourseCard({ tutor, onClick }) {
  // Use tutor.image if available otherwise fallback to the sample screenshots
  const defaultImages = [
    "/mnt/data/Screenshot 2025-11-20 190636.png",
    "/mnt/data/Screenshot 2025-11-20 190651.png",
    "/mnt/data/Screenshot 2025-11-20 190711.png",
  ];
  const imgSrc = tutor.image || defaultImages[Math.floor(Math.random() * defaultImages.length)];

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition overflow-hidden"
    >
      <div className="h-56 md:h-48 lg:h-56 w-full overflow-hidden">
        <img src={imgSrc} alt={tutor.name} className="w-full h-full object-cover rounded-t-2xl" />
      </div>

      <div className="p-4 md:p-5">
        <h3 className="text-lg font-semibold mb-1">{tutor.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{tutor.subject || (tutor.subjects && tutor.subjects[0]) || "Subject"}</p>

        <div className="flex items-center text-sm text-gray-500 gap-3 mb-3">
          <span className="inline-flex items-center gap-2 px-2 py-1 border rounded-full">
            <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927C9.324 2.11 10.676 2.11 10.951 2.927l.9 3.34a1 1 0 00.95.69h3.513c.969 0 1.371 1.24.588 1.81l-2.845 2.03a1 1 0 00-.364 1.118l.9 3.341c.275.817-.69 1.49-1.418 1.03L10 15.347l-2.324 1.739c-.728.46-1.693-.213-1.418-1.03l.9-3.341a1 1 0 00-.364-1.118L3.95 8.767c-.783-.57-.38-1.81.588-1.81h3.513a1 1 0 00.95-.69l.9-3.34z" /></svg>
            <span className="font-medium text-gray-700">{tutor.rating ?? "4.5"}</span>
          </span>

          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{tutor.ratingsCount ? `${tutor.ratingsCount} ratings` : "3.7K ratings"}</span>

          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{tutor.hours ? `${tutor.hours} total hours` : "28.4 total hours"}</span>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 bg-purple-600 text-white py-2 rounded-md text-sm hover:bg-purple-700 transition">
            View
          </button>
          <div className="w-28">
            <button className="w-full bg-white border border-gray-200 text-sm text-gray-800 py-2 rounded-md hover:bg-gray-50">
              ₹{tutor.price || 0}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
