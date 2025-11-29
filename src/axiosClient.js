import axios from "axios";

const api = axios.create({
  baseURL: "https://lms-back-nh5h.onrender.com/api",
  withCredentials: false, // you are using JWT, not cookies
});

// Automatically attach Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
