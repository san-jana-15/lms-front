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

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="bg-white shadow rounded-xl p-6 max-w-lg">

          {/* NAME */}
          <label className="block mb-4">
            <span className="text-gray-700">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </label>

          {/* EMAIL */}
          <label className="block mb-4">
            <span className="text-gray-700">Email</span>
            <input
              value={user.email}
              readOnly
              className="w-full border p-2 bg-gray-200 rounded mt-1"
            />
          </label>

          {/* CONTACT NUMBER */}
          <label className="block mb-4">
            <span className="text-gray-700">Contact Number</span>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </label>

          {/* GENDER */}
          <label className="block mb-4">
            <span className="text-gray-700">Gender</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          {/* OCCUPATION */}
          <label className="block mb-4">
            <span className="text-gray-700">Occupation</span>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="">Select</option>
              <option value="Student">Student</option>
              <option value="Fresher">Fresher</option>
              <option value="Graduate">Graduate</option>
              <option value="Working Professional">Working Professional</option>
            </select>
          </label>

          <button
            onClick={saveProfile}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded mt-3"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
