import React, { useEffect, useState } from "react";
import api from "../../axiosClient";
import { FiPlay, FiTrash2, FiUpload } from "react-icons/fi";

const TutorRecordings = () => {
  const [recordings, setRecordings] = useState([]);

  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");       // NEW
  const [price, setPrice] = useState("");           // NEW

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      const res = await api.get("/recordings/tutor");
      setRecordings(res.data || []);
    } catch (err) {
      console.error(err);
      setRecordings([]);
    }
  };

  const upload = async () => {
    if (!file) return alert("Choose a file first");
    if (!subject) return alert("Subject is required");
    if (!price) return alert("Price is required");

    try {
      setUploading(true);

      const fd = new FormData();
      fd.append("recording", file);
      fd.append("description", description);
      fd.append("subject", subject);    // NEW
      fd.append("price", price);        // NEW

      await api.post("/recordings/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Uploaded successfully");
      setFile(null);
      setDescription("");
      setSubject("");     // CLEAR
      setPrice("");       // CLEAR

      fetchRecordings();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteRecording = async (id) => {
    if (!window.confirm("Delete this recording?")) return;

    try {
      await api.delete(`/recordings/${id}`);
      fetchRecordings();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">🎥 Lesson Recordings</h2>

      {/* Upload Section */}
      <div className="bg-white p-6 mb-8 rounded-2xl shadow-lg border">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiUpload className="text-blue-600" /> Upload New Recording
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* File */}
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-3 rounded-lg shadow-sm"
          />

          {/* Description */}
          <input
            type="text"
            value={description}
            placeholder="Enter description"
            onChange={(e) => setDescription(e.target.value)}
            className="border p-3 rounded-lg shadow-sm"
          />

          {/* Subject (NEW) */}
          <input
            type="text"
            value={subject}
            placeholder="Enter subject"
            onChange={(e) => setSubject(e.target.value)}
            className="border p-3 rounded-lg shadow-sm"
          />

          {/* Price (NEW) */}
          <input
            type="number"
            value={price}
            placeholder="Enter price (₹)"
            onChange={(e) => setPrice(e.target.value)}
            className="border p-3 rounded-lg shadow-sm"
          />
        </div>

        <button
          onClick={upload}
          disabled={uploading}
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md"
        >
          {uploading ? "Uploading..." : "Upload Recording"}
        </button>
      </div>

      {/* Recordings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recordings.map((r) => (
          <div
            key={r._id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border group"
          >
            {/* Video Thumbnail */}
            <div className="relative">
              <video
                src={`http://localhost:5000${r.filePath}`}
                className="w-full h-40 object-cover opacity-90 group-hover:opacity-100 transition"
              ></video>

              <button
                onClick={() => setSelectedVideo(`http://localhost:5000${r.filePath}`)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition"
              >
                <FiPlay className="text-white text-4xl" />
              </button>
            </div>

            {/* Info Section */}
            <div className="p-4">
              <h4 className="text-lg font-semibold">{r.originalFileName}</h4>

              {/* Description */}
              <p className="text-gray-600 text-sm">{r.description || "No description"}</p>

              {/* Subject */}
              <p className="text-sm text-gray-700 mt-1">
                <strong>Subject:</strong> {r.subject || "—"}
              </p>

              {/* Price */}
              <p className="text-sm text-green-700 font-bold mt-1">
                Price: ₹{r.price || 0}
              </p>

              <p className="text-xs text-gray-500 mt-2">
                {new Date(r.createdAt).toLocaleString()}
              </p>

              <button
                onClick={() => deleteRecording(r._id)}
                className="mt-3 px-4 py-2 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
          <div className="relative bg-white rounded-xl p-4 max-w-4xl w-full shadow-xl">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-3 -right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition"
              style={{ zIndex: 10000 }}
            >
              ✖
            </button>

            <video
              controls
              autoPlay
              src={selectedVideo}
              className="w-full h-[500px] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorRecordings;
