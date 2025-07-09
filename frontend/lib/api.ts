import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authApi = {
  login: (email: string, password: string) => api.post("/login", { email, password }),
  register: (name: string, email: string, password: string, role: string) =>
    api.post("/register", { name, email, password, role }),
  logout: () => api.post("/logout"),
  me: () => api.get("/me"),
}

// Projects API
export const projectsApi = {
  getAll: () => api.get("/projects"),
  create: (data: any) => api.post("/projects", data),
  getById: (id: string) => api.get(`/projects/${id}`),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
}

// Tasks API
export const tasksApi = {
  getAll: (params?: any) => api.get("/tasks", { params }),
  create: (data: any) => api.post("/tasks", data),
  getById: (id: string) => api.get(`/tasks/${id}`),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/tasks/${id}/status`, { status }),
}
