import api from "../axios";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  User,
} from "../types/api";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/login", credentials);

    // Debug log (opsional)
    console.log("🛰️ Raw login response:", response.data);

    return response.data; // ✅ karena structure-nya langsung { user, token }
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get<User>("/me");
    return response.data;
  },
};
