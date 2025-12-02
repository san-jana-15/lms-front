// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://lms-back-nh5h.onrender.com";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      const auth = getAuthHeader();
      const res = await axios.get(`${API}/api/admin/users`, auth);
      setUsers(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      const auth = getAuthHeader();
      await axios.put(`${API}/api/admin/toggle/${id}`, {}, auth);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isActive: !user.isActive } : user
        )
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-700">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Manage users, roles and access</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 md:flex-none border p-3 rounded-xl shadow-sm w-full md:w-80 focus:ring-2 focus:ring-purple-200 outline-none bg-white"
            />

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-xl border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Loading users...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{u.name}</div>
                        <div className="text-xs text-gray-500">{u._id}</div>
                      </td>

                      <td className="p-4 text-gray-700">{u.email}</td>

                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => changeUserRole(u._id, e.target.value)}
                          className="border p-2 rounded-lg"
                        >
                          <option value="student">Student</option>
                          <option value="tutor">Tutor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => toggleUserStatus(u._id)}
                          className={`px-4 py-2 rounded-lg font-medium shadow ${
                            u.isActive ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"
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
    </div>
  );
};

export default AdminDashboard;
