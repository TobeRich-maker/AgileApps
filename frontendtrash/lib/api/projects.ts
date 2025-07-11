import api from "@/lib/axios";

import type {
  Project,
  CreateProjectRequest,
  ApiResponse,
  PaginatedResponse,
} from "../types/api";
console.log("Memanggil GET /projects");

export const projectsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    difficulty?: string;
    search?: string;
  }): Promise<PaginatedResponse<Project>> => {
    console.log("🚀 Calling /projects API...");
    const response = await api.get<PaginatedResponse<Project>>("/projects", {
      params,
    });
    console.log("✅ Projects API Response:", response.data);
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  },

  create: async (projectData: CreateProjectRequest): Promise<Project> => {
    const response = await api.post<ApiResponse<Project>>(
      "/projects",
      projectData
    );
    return response.data.data;
  },

  update: async (
    id: string,
    projectData: Partial<CreateProjectRequest>
  ): Promise<Project> => {
    const response = await api.put<ApiResponse<Project>>(
      `/projects/${id}`,
      projectData
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  addTeamMember: async (projectId: string, userId: string): Promise<void> => {
    await api.post(`/projects/${projectId}/team-members`, { userId });
  },

  removeTeamMember: async (
    projectId: string,
    userId: string
  ): Promise<void> => {
    await api.delete(`/projects/${projectId}/team-members/${userId}`);
  },
};
