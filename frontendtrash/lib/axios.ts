// lib/axios.ts
import axios from "axios";
import { useAuthStore } from "@/lib/stores/auth-store";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
  },
});

// ✅ Tambahkan token sebelum setiap request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Bearer token attached:", token);
    } else {
      console.warn("🚫 Token is null in Zustand store at request time");
    }
  }
  return config;
});

// ✅ Tambahkan alert saat response error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn("🔐 Unauthorized access - invalid token");
        if (typeof window !== "undefined") {
          alert("Session expired or unauthorized. Please login again.");
        }
      }

      if (status === 403) {
        console.warn("⛔ Forbidden - no permission");
        if (typeof window !== "undefined") {
          alert("You don't have permission to access this resource.");
        }
      }
    } else {
      console.error("❌ Network or unknown error:", error.message);
      if (typeof window !== "undefined") {
        alert("Network error occurred. Please check your connection.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
