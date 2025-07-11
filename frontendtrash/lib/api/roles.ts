import api from "../axios"
import type { Role, CreateRoleRequest, ApiResponse, PaginatedResponse } from "../types/api"

export const rolesApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<PaginatedResponse<Role>> => {
    const response = await api.get<PaginatedResponse<Role>>("/roles", { params })
    return response.data
  },

  getById: async (id: string): Promise<Role> => {
    const response = await api.get<ApiResponse<Role>>(`/roles/${id}`)
    return response.data.data
  },

  create: async (roleData: CreateRoleRequest): Promise<Role> => {
    const response = await api.post<ApiResponse<Role>>("/roles", roleData)
    return response.data.data
  },

  update: async (id: string, roleData: Partial<CreateRoleRequest>): Promise<Role> => {
    const response = await api.put<ApiResponse<Role>>(`/roles/${id}`, roleData)
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/roles/${id}`)
  },

  getPermissions: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>("/roles/permissions")
    return response.data.data
  },
}
