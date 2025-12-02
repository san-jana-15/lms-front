// src/pages/TutorDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function TutorDetail() {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const navigate = useNavigate();

  const API = "https://lms-back-nh5h.onrender.com";

  useEffect(() => {
    axios
      .get(`${API}/api/tutors`)
      .then((res) => {
        const t = res.data.find((x) => x._id === tutorId);
        if (t) setTutor(t);
      })
      .catch((err) => console.error(err));
  }, [tutorId]);

  if (!tutor) return <p className="p-6">Loading...</p>;

  const heroImage = tutor.image || "/mnt/data/Screenshot 2025-11-20 190651.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta">
      {/* Purple hero */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4">{tutor.name}</h1>
            <p className="text-lg text-purple-100 mb-4">{tutor.subject}</p>

            <div className="flex gap-8 text-white/90 mb-6">
              <div>
                <div className="text-xl font-bold">{tutor.rating ?? "4.4"}</div>
                <div className="text-sm opacity-90">average rating</div>
              </div>

              <div>
                <div className="text-xl font-bold">{tutor.hours ?? 28.4}</div>
                <div className="text-sm opacity-90">hours of content</div>
              </div>

              <div>
                <div className="text-xl font-bold">{tutor.experienceYears ?? "—"}</div>
                <div className="text-sm opacity-90">years experience</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/checkout/${tutor._id}`)}
                className="px-6 py-3 rounded-xl bg-white text-purple-700 font-semibold hover:opacity-95 shadow"
              >
                Get started
              </button>

              <button
                onClick={() => navigate(`/checkout/${tutor._id}`)}
                className="px-6 py-3 rounded-xl bg-white/10 border border-white text-white hover:bg-white/20"
              >
                Preview
              </button>
            </div>

            <p className="mt-6 text-purple-100 max-w-prose">{tutor.bio || "No bio provided."}</p>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-lg border">
              <img src={heroImage} alt={tutor.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
              <p className="text-gray-700 mb-4">
                Learn the fundamentals and advanced techniques in <strong>{tutor.subject}</strong>. Sessions are tailored, interactive and focused on real results.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* example bullets (keep or replace with real points) */}
                <div className="p-4 border rounded-lg bg-white/50">
                  <h4 className="font-semibold">Structured Curriculum</h4>
                  <p className="text-sm text-gray-600 mt-1">Clear lessons and progression tailored to you.</p>
                </div>

                <div className="p-4 border rounded-lg bg-white/50">
                  <h4 className="font-semibold">Project-based Learning</h4>
                  <p className="text-sm text-gray-600 mt-1">Hands-on projects to build practical skills.</p>
                </div>
              </div>
            </section>

            {/* More sections can be added here */}
          </div>

          <aside className="p-6 border rounded-2xl bg-white shadow">
            <div className="text-sm text-gray-600 mb-2">From</div>
            <div className="text-2xl font-bold mb-3">₹{tutor.price || 0}</div>
            <div className="text-xs text-gray-500 mb-4">{tutor.subject}</div>

            <button
              onClick={() => navigate(`/checkout/${tutor._id}`)}
              className="w-full bg-gradient-to-r from-green-600 to-blue-500 text-white py-3 rounded-xl font-semibold shadow hover:opacity-95"
            >
              Pay Now
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
