// src/pages/Student/StudentProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentSidebar from "../components/StudentSidebar";

const StudentProfile = () => {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://lms-back-nh5h.onrender.com/api/auth/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data);
      setName(res.data.name);
      setContact(res.data.contact);
      setGender(res.data.gender);
      setOccupation(res.data.occupation);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "https://lms-back-nh5h.onrender.com/api/auth/update-profile",
        { name, contact, gender, occupation },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile updated!");
      loadProfile();
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    }
  };

  if (!user)
    return (
      <p className="text-center mt-10 font-jakarta text-lg text-gray-600">
        Loading...
      </p>
    );

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta">
      <StudentSidebar />

      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          My Profile
        </h1>

        <div className="bg-white shadow-xl rounded-3xl p-8 max-w-xl border border-gray-100">

          {/* NAME */}
          <label className="block mb-5">
            <span className="text-gray-700 font-medium">Full Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1 shadow-sm focus:ring-2 focus:ring-purple-300"
            />
          </label>

          {/* EMAIL */}
          <label className="block mb-5">
            <span className="text-gray-700 font-medium">Email</span>
            <input
              value={user.email}
              readOnly
              className="w-full border p-3 bg-gray-100 rounded-xl mt-1 shadow-sm cursor-not-allowed"
            />
          </label>

          {/* CONTACT */}
          <label className="block mb-5">
            <span className="text-gray-700 font-medium">Contact Number</span>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1 shadow-sm focus:ring-2 focus:ring-purple-300"
            />
          </label>

          {/* GENDER */}
          <label className="block mb-5">
            <span className="text-gray-700 font-medium">Gender</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1 shadow-sm focus:ring-2 focus:ring-purple-300"
            >
              <option value="">Select gender...</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>

          {/* OCCUPATION */}
          <label className="block mb-5">
            <span className="text-gray-700 font-medium">Occupation</span>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1 shadow-sm focus:ring-2 focus:ring-purple-300"
            >
              <option value="">Select occupation...</option>
              <option>Student</option>
              <option>Fresher</option>
              <option>Graduate</option>
              <option>Working Professional</option>
            </select>
          </label>

          {/* SAVE BUTTON */}
          <button
            onClick={saveProfile}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl text-lg font-semibold shadow hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
