import { create } from "zustand"
import { persist } from "zustand/middleware"
import { api } from "../lib/api"

interface Team {
  id: string
  name: string
  description: string
  created_by: string
  is_active: boolean
  creator: {
    id: string
    name: string
    email: string
  }
  members: Array<{
    id: string
    name: string
    email: string
    role: string
    avatar?: string
  }>
  projects?: Array<any>
}

interface TeamState {
  teams: Team[]
  currentTeam: Team | null
  loading: boolean
  fetchTeams: () => Promise<void>
  createTeam: (team: Omit<Team, "id" | "creator" | "members">) => Promise<void>
  updateTeam: (id: string, updates: Partial<Team>) => Promise<void>
  deleteTeam: (id: string) => Promise<void>
  addMember: (teamId: string, userId: string) => Promise<void>
  removeMember: (teamId: string, userId: string) => Promise<void>
  setCurrentTeam: (team: Team) => void
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teams: [],
      currentTeam: null,
      loading: false,

      fetchTeams: async () => {
        try {
          set({ loading: true })
          const response = await api.get("/teams")
          set({ teams: response.data })
        } catch (error) {
          console.error("Failed to fetch teams:", error)
        } finally {
          set({ loading: false })
        }
      },

      createTeam: async (teamData) => {
        try {
          set({ loading: true })
          const response = await api.post("/teams", teamData)
          set((state) => ({
            teams: [...state.teams, response.data],
          }))
        } catch (error) {
          console.error("Failed to create team:", error)
          throw error
        } finally {
          set({ loading: false })
        }
      },

      updateTeam: async (id: string, updates: Partial<Team>) => {
        try {
          const response = await api.put(`/teams/${id}`, updates)
          set((state) => ({
            teams: state.teams.map((team) => (team.id === id ? response.data : team)),
            currentTeam: state.currentTeam?.id === id ? response.data : state.currentTeam,
          }))
        } catch (error) {
          console.error("Failed to update team:", error)
          throw error
        }
      },

      deleteTeam: async (id: string) => {
        try {
          await api.delete(`/teams/${id}`)
          set((state) => ({
            teams: state.teams.filter((team) => team.id !== id),
            currentTeam: state.currentTeam?.id === id ? null : state.currentTeam,
          }))
        } catch (error) {
          console.error("Failed to delete team:", error)
          throw error
        }
      },

      addMember: async (teamId: string, userId: string) => {
        try {
          const response = await api.post(`/teams/${teamId}/members`, { user_id: userId })
          set((state) => ({
            teams: state.teams.map((team) => (team.id === teamId ? response.data : team)),
          }))
        } catch (error) {
          console.error("Failed to add member:", error)
          throw error
        }
      },

      removeMember: async (teamId: string, userId: string) => {
        try {
          const response = await api.delete(`/teams/${teamId}/members`, { data: { user_id: userId } })
          set((state) => ({
            teams: state.teams.map((team) => (team.id === teamId ? response.data : team)),
          }))
        } catch (error) {
          console.error("Failed to remove member:", error)
          throw error
        }
      },

      setCurrentTeam: (team: Team) => {
        set({ currentTeam: team })
      },
    }),
    {
      name: "team-storage",
    },
  ),
)
