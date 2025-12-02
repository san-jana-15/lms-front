// src/pages/TutorSetupPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND = "https://lms-back-nh5h.onrender.com";

export default function TutorSetupPage() {
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [subjects, setSubjects] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [languages, setLanguages] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BACKEND}/api/tutors/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const p = res.data || {};
      setHeadline(p.headline || "");
      setBio(p.bio || "");
      setSubjects((p.subjects || []).join(", "));
      setHourlyRate(p.hourlyRate || "");
      setLanguages((p.languages || []).join(", "));
      setExperienceYears(p.experienceYears || "");
    } catch (err) {
      console.error("Load profile error:", err);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `${BACKEND}/api/tutors/profile/update`,
        {
          headline,
          bio,
          subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
          hourlyRate: Number(hourlyRate),
          languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
          experienceYears: Number(experienceYears),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile saved!");
      navigate("/dashboard/tutor");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-xl border">
        <h2 className="text-3xl font-extrabold text-purple-700 mb-4">Tutor Profile Setup</h2>
        <p className="text-sm text-gray-600 mb-6">Fill these details to make your profile discoverable and trustworthy for students.</p>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Headline</span>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-purple-200"
              placeholder="Short headline (e.g., Physics tutor for IIT-JEE)"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-purple-200"
              rows={5}
              placeholder="Introduce yourself, your teaching approach and achievements"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              <span className="text-sm font-medium text-gray-700">Subjects (comma separated)</span>
              <input
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-purple-200"
                placeholder="Math, Physics"
              />
            </label>

            <label>
              <span className="text-sm font-medium text-gray-700">Languages (comma separated)</span>
              <input
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-purple-200"
                placeholder="English, Tamil"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label>
              <span className="text-sm font-medium text-gray-700">Hourly Rate (₹)</span>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-purple-200"
              />
            </label>

            <label>
              <span className="text-sm font-medium text-gray-700">Experience (years)</span>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-purple-200"
              />
            </label>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
