import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api } from "../lib/api"

interface Notification {
  id: string
  title: string
  message: string
  type: "task" | "sprint" | "standup" | "bug" | "system"
  data?: any
  read_at?: string
  action_url?: string
  created_at: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  fetchNotifications: (filters?: any) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  getUnreadCount: () => Promise<void>
  addNotification: (notification: Notification) => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      loading: false,

      fetchNotifications: async (filters = {}) => {
        try {
          set({ loading: true })
          const response = await api.get("/notifications", { params: filters })
          set({ notifications: response.data.data || response.data })
        } catch (error) {
          console.error("Failed to fetch notifications:", error)
        } finally {
          set({ loading: false })
        }
      },

      markAsRead: async (id: string) => {
        try {
          await api.post(`/notifications/${id}/read`)
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification.id === id ? { ...notification, read_at: new Date().toISOString() } : notification,
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }))
        } catch (error) {
          console.error("Failed to mark notification as read:", error)
        }
      },

      markAllAsRead: async () => {
        try {
          await api.post("/notifications/read-all")
          set((state) => ({
            notifications: state.notifications.map((notification) => ({
              ...notification,
              read_at: notification.read_at || new Date().toISOString(),
            })),
            unreadCount: 0,
          }))
        } catch (error) {
          console.error("Failed to mark all notifications as read:", error)
        }
      },

      deleteNotification: async (id: string) => {
        try {
          await api.delete(`/notifications/${id}`)
          set((state) => ({
            notifications: state.notifications.filter((notification) => notification.id !== id),
            unreadCount: state.notifications.find((n) => n.id === id && !n.read_at)
              ? state.unreadCount - 1
              : state.unreadCount,
          }))
        } catch (error) {
          console.error("Failed to delete notification:", error)
        }
      },

      getUnreadCount: async () => {
        try {
          const response = await api.get("/notifications/unread-count")
          set({ unreadCount: response.data.count })
        } catch (error) {
          console.error("Failed to get unread count:", error)
        }
      },

      addNotification: (notification: Notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
      },
    }),
    {
      name: "notification-storage",
    },
  ),
)
