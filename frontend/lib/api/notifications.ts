import api from "../axios";
import type {
  Notification,
  ApiResponse,
  PaginatedResponse,
} from "../types/api";

export const notificationsApi = {
  getAll: async (params?: {
    read?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get<PaginatedResponse<Notification>>(
      "/notifications",
      { params },
    );
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<{ count: number }>>(
      "/notifications/unread-count",
    );
    return response.data.data.count;
  },
};
