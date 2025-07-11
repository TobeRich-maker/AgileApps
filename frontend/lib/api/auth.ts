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
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/login",
      credentials
    );
    return response.data.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      userData
    );
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/refresh",
      {
        refreshToken,
      }
    );
    return response.data.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>("/project");
    return response.data.data;
  },
};
