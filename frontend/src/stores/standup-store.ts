import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api } from "../lib/api"

interface Standup {
  id: string
  user_id: string
  sprint_id: string
  date: string
  yesterday_work?: string
  today_plan?: string
  blockers?: string
  created_at: string
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  sprint?: {
    id: string
    name: string
    project: {
      id: string
      name: string
    }
  }
}

interface StandupState {
  standups: Standup[]
  loading: boolean
  fetchStandups: (filters?: any) => Promise<void>
  createStandup: (standup: Omit<Standup, "id" | "created_at" | "user_id">) => Promise<void>
  updateStandup: (id: string, updates: Partial<Standup>) => Promise<void>
  deleteStandup: (id: string) => Promise<void>
  getTeamStandup: (sprintId: string, date: string) => Promise<Standup[]>
}

export const useStandupStore = create<StandupState>()(
  persist(
    (set, get) => ({
      standups: [],
      loading: false,

      fetchStandups: async (filters = {}) => {
        try {
          set({ loading: true })
          const response = await api.get("/standups", { params: filters })
          set({ standups: response.data })
        } catch (error) {
          console.error("Failed to fetch standups:", error)
        } finally {
          set({ loading: false })
        }
      },

      createStandup: async (standupData) => {
        try {
          set({ loading: true })
          const response = await api.post("/standups", standupData)
          set((state) => {
            const existingIndex = state.standups.findIndex(
              (s) => s.sprint_id === response.data.sprint_id && s.date === response.data.date,
            )
            if (existingIndex >= 0) {
              // Update existing standup
              const updatedStandups = [...state.standups]
              updatedStandups[existingIndex] = response.data
              return { standups: updatedStandups }
            } else {
              // Add new standup
              return { standups: [...state.standups, response.data] }
            }
          })
        } catch (error) {
          console.error("Failed to create standup:", error)
          throw error
        } finally {
          set({ loading: false })
        }
      },

      updateStandup: async (id: string, updates: Partial<Standup>) => {
        try {
          const response = await api.put(`/standups/${id}`, updates)
          set((state) => ({
            standups: state.standups.map((standup) => (standup.id === id ? response.data : standup)),
          }))
        } catch (error) {
          console.error("Failed to update standup:", error)
          throw error
        }
      },

      deleteStandup: async (id: string) => {
        try {
          await api.delete(`/standups/${id}`)
          set((state) => ({
            standups: state.standups.filter((standup) => standup.id !== id),
          }))
        } catch (error) {
          console.error("Failed to delete standup:", error)
          throw error
        }
      },

      getTeamStandup: async (sprintId: string, date: string) => {
        try {
          const response = await api.get("/standups/team/daily", {
            params: { sprint_id: sprintId, date },
          })
          return response.data
        } catch (error) {
          console.error("Failed to get team standup:", error)
          return []
        }
      },
    }),
    {
      name: "standup-storage",
    },
  ),
)
