import api from "../axios";
import type { Team, CreateTeamRequest, ApiResponse } from "../types/api";

export const teamApi = {
  getAll: async (): Promise<Team[]> => {
    const response = await api.get<Team[]>("/teams");
    return response.data;
  },

  getById: async (id: number): Promise<Team> => {
    const response = await api.get<ApiResponse<Team>>(`/teams/${id}`);
    return response.data.data;
  },

  create: async (teamData: CreateTeamRequest): Promise<Team> => {
    const response = await api.post<ApiResponse<Team>>("/teams", teamData);
    return response.data.data;
  },

  update: async (
    id: number,
    teamData: Partial<CreateTeamRequest>
  ): Promise<Team> => {
    const response = await api.put<ApiResponse<Team>>(`/teams/${id}`, teamData);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/teams/${id}`);
  },

  addMember: async (teamId: number, userId: number): Promise<Team> => {
    const response = await api.post<ApiResponse<Team>>(
      `/teams/${teamId}/add-member`,
      {
        user_id: userId,
      }
    );
    return response.data.data;
  },

  removeMember: async (teamId: number, userId: number): Promise<Team> => {
    const response = await api.post<ApiResponse<Team>>(
      `/teams/${teamId}/remove-member`,
      {
        user_id: userId,
      }
    );
    return response.data.data;
  },
};
