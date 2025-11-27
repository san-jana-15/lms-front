import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://lms-back-nh5h.onrender.com/api",
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
