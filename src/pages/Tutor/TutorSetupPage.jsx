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
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BACKEND}/api/tutors/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const p = res.data;
      if (!p) return;

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Tutor Profile Setup</h2>

        <label className="block mb-3">
          <span>Headline</span>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <label className="block mb-3">
          <span>Bio</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            rows={4}
          />
        </label>

        <label className="block mb-3">
          <span>Subjects (comma separated)</span>
          <input
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            placeholder="Math, Physics"
          />
        </label>

        <label className="block mb-3">
          <span>Languages (comma separated)</span>
          <input
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            placeholder="English, Tamil"
          />
        </label>

        <label className="block mb-3">
          <span>Hourly Rate (₹)</span>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <label className="block mb-3">
          <span>Experience Years</span>
          <input
            type="number"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <button
          disabled={loading}
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
