// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://lms-back-nh5h.onrender.com";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const loadUsers = async () => {
    try {
      const auth = getAuthHeader();
      const res = await axios.get(`${API}/api/admin/users`, auth);
      setUsers(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      const auth = getAuthHeader();
      await axios.put(`${API}/api/admin/toggle/${id}`, {}, auth);
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, isActive: !user.isActive } : user))
      );
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Failed to toggle user status");
    }
  };

  const changeUserRole = async (id, role) => {
    try {
      const auth = getAuthHeader();
      await axios.put(`${API}/api/admin/role/${id}`, { role }, auth);
      setUsers((prev) => prev.map((user) => (user._id === id ? { ...user, role } : user)));
    } catch (err) {
      console.error("Role change error:", err);
      alert("Failed to change role");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 md:flex-none border p-2 rounded-lg shadow-sm w-full md:w-80 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow-xl rounded-xl p-4">
          <table className="w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="border-b hover:bg-blue-50 transition">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => changeUserRole(u._id, e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3">
                      {u.isActive ? (
                        <span className="text-green-600 font-semibold">Active</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleUserStatus(u._id)}
                        className={`px-3 py-1 rounded font-medium ${
                          u.isActive
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
