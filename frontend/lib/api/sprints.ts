import api from "../axios";
import type {
  Sprint,
  CreateSprintRequest,
  UpdateSprintOrderRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types/api";

export const sprintsApi = {
  getAll: async (params?: {
    projectId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Sprint>> => {
    const response = await api.get<PaginatedResponse<Sprint>>("/sprints", {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Sprint> => {
    const response = await api.get<ApiResponse<Sprint>>(`/sprints/${id}`);
    return response.data.data;
  },

  create: async (sprintData: CreateSprintRequest): Promise<Sprint> => {
    const response = await api.post<ApiResponse<Sprint>>(
      "/sprints",
      sprintData,
    );
    return response.data.data;
  },

  update: async (
    id: string,
    sprintData: Partial<CreateSprintRequest>,
  ): Promise<Sprint> => {
    const response = await api.put<ApiResponse<Sprint>>(
      `/sprints/${id}`,
      sprintData,
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/sprints/${id}`);
  },

  updateOrder: async (updates: UpdateSprintOrderRequest[]): Promise<void> => {
    await api.put("/sprints/reorder", { updates });
  },

  start: async (id: string): Promise<Sprint> => {
    const response = await api.post<ApiResponse<Sprint>>(
      `/sprints/${id}/start`,
    );
    return response.data.data;
  },

  complete: async (id: string): Promise<Sprint> => {
    const response = await api.post<ApiResponse<Sprint>>(
      `/sprints/${id}/complete`,
    );
    return response.data.data;
  },
};
