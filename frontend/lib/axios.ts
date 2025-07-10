import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth-storage");
  if (auth) {
    try {
      const parsed = JSON.parse(auth);
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("❌ Failed to parse token from auth-storage", err);
    }
  }
  return config;
});

export default api;
