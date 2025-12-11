// src/pages/TutorRecordings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPlay, FiTrash2, FiUpload } from "react-icons/fi";

const API = "https://lms-back-nh5h.onrender.com";

const TutorRecordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // <-- IMPORTANT

  useEffect(() => {
    fetchRecordings();
  }, []);

  // =======================
  // FETCH RECORDINGS
  // =======================
  const fetchRecordings = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/recordings/tutor`, {
        headers: {
          Authorization: `Bearer ${token}`, // <-- FIXED
        },
      });

      setRecordings(res.data || []);
    } catch (err) {
      console.error("Fetch recordings error:", err);
      setRecordings([]);
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // UPLOAD RECORDING
  // =======================
  const upload = async () => {
    if (!file) return alert("Choose a file first");
    if (!subject) return alert("Subject is required");
    if (!price) return alert("Price is required");

    try {
      setUploading(true);

      const fd = new FormData();
      fd.append("recording", file);
      fd.append("description", description);
      fd.append("subject", subject);
      fd.append("price", price);

      await axios.post(`${API}/api/recordings/upload`, fd, {
        headers: {
          Authorization: `Bearer ${token}`, // <-- FIXED
        },
      });

      alert("Uploaded successfully");
      setFile(null);
      setDescription("");
      setSubject("");
      setPrice("");

      fetchRecordings();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // =======================
  // DELETE RECORDING
  // =======================
  const deleteRecording = async (id) => {
    if (!window.confirm("Delete this recording?")) return;

    try {
      await axios.delete(`${API}/api/recordings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // <-- FIXED
        },
      });

      fetchRecordings();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-jakarta">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-6 text-purple-700">
          🎥 Lesson Recordings
        </h2>

        {/* Upload Section */}
        <div className="bg-white p-6 mb-8 rounded-2xl shadow-xl border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FiUpload className="text-purple-600" /> Upload New Recording
            </h3>
            <div className="text-sm text-gray-500">
              {loading ? "Loading..." : `${recordings.length} recordings`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-3 rounded-xl"
            />

            <input
              type="text"
              value={description}
              placeholder="Short description"
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 rounded-xl"
            />

            <input
              type="text"
              value={subject}
              placeholder="Subject (e.g., Math)"
              onChange={(e) => setSubject(e.target.value)}
              className="border p-3 rounded-xl"
            />

            <input
              type="number"
              value={price}
              placeholder="Price (₹)"
              onChange={(e) => setPrice(e.target.value)}
              className="border p-3 rounded-xl"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={upload}
              disabled={uploading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow"
            >
              {uploading ? "Uploading..." : "Upload Recording"}
            </button>
          </div>
        </div>

        {/* Recordings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recordings.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition border"
            >
              <div className="relative">
                <video
                  src={`${API}${r.filePath}`}
                  className="w-full h-44 object-cover"
                  muted
                />
                <button
                  onClick={() => setSelectedVideo(`${API}${r.filePath}`)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition"
                >
                  <FiPlay className="text-white text-4xl" />
                </button>
              </div>

              <div className="p-4">
                <h4 className="text-lg font-semibold">{r.originalFileName}</h4>
                <p className="text-gray-600 text-sm">
                  {r.description || "No description"}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Subject:</strong> {r.subject || "—"}
                    </p>
                    <p className="text-sm text-green-700 font-bold">
                      ₹{r.price || 0}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </div>

                    <button
                      onClick={() => deleteRecording(r._id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-4 max-w-4xl w-full shadow-2xl relative">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-3 -right-3 bg-red-600 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700"
              >
                ✕
              </button>

              <video
                controls
                autoPlay
                src={selectedVideo}
                className="w-full rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorRecordings;
