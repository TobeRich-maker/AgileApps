import api from "../axios";
import type {
  User,
  CreateUserRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types/api";

export const usersApi = {
  getAll: async (params?: {
    role?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>("/users", {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  create: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post<ApiResponse<User>>("/users", userData);
    return response.data.data;
  },

  update: async (
    id: string,
    userData: Partial<CreateUserRequest>,
  ): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  updateRole: async (id: string, roleId: string): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}/role`, {
      roleId,
    });
    return response.data.data;
  },
};
