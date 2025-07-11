import api from "../axios";
import type {
  Task,
  CreateTaskRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types/api";

export const tasksApi = {
  getAll: async (params?: {
    sprintId?: string;
    assigneeId?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Task>> => {
    const response = await api.get<PaginatedResponse<Task>>("/tasks", {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  create: async (taskData: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>("/tasks", taskData);
    return response.data.data;
  },

  update: async (
    id: string,
    taskData: Partial<CreateTaskRequest>,
  ): Promise<Task> => {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, taskData);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  updateStatus: async (id: string, status: string): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  assign: async (id: string, assigneeId: string): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/assign`, {
      assigneeId,
    });
    return response.data.data;
  },
};
