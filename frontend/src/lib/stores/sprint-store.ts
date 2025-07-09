"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Sprint {
  id: string
  name: string
  goal: string
  start_date: string
  end_date: string
  status: "planned" | "active" | "completed"
  project_id: string
  story_points_planned: number
  story_points_completed: number
  tasks: Task[]
}

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "done"
  priority: "low" | "medium" | "high"
  story_points: number
  project_id: string
  sprint_id?: string
  assignee_id?: string
  creator_id: string
  due_date?: string
  tags?: string[]
  created_at: string
  assignee?: any
  creator?: any
}

interface SprintState {
  sprints: Sprint[]
  currentSprint: Sprint | null
  loading: boolean
  fetchSprints: (projectId?: string) => Promise<void>
  createSprint: (sprint: Omit<Sprint, "id" | "tasks">) => Promise<void>
  updateSprint: (id: string, updates: Partial<Sprint>) => Promise<void>
  deleteSprint: (id: string) => Promise<void>
  setCurrentSprint: (sprint: Sprint) => void
  addTaskToSprint: (sprintId: string, task: Task) => void
  removeTaskFromSprint: (sprintId: string, taskId: string) => void
}

// Mock data for demonstration
const mockSprints: Sprint[] = [
  {
    id: "1",
    name: "Sprint 1 - Foundation",
    goal: "Set up core authentication and project structure",
    start_date: "2024-01-15",
    end_date: "2024-01-29",
    status: "completed",
    project_id: "1",
    story_points_planned: 21,
    story_points_completed: 21,
    tasks: [],
  },
  {
    id: "2",
    name: "Sprint 2 - Core Features",
    goal: "Implement task management and kanban board",
    start_date: "2024-01-30",
    end_date: "2024-02-13",
    status: "active",
    project_id: "1",
    story_points_planned: 34,
    story_points_completed: 18,
    tasks: [],
  },
]

export const useSprintStore = create<SprintState>()(
  persist(
    (set, get) => ({
      sprints: mockSprints,
      currentSprint: mockSprints[1], // Active sprint
      loading: false,

      fetchSprints: async (projectId?: string) => {
        set({ loading: true })
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        let filteredSprints = mockSprints
        if (projectId) {
          filteredSprints = mockSprints.filter((s) => s.project_id === projectId)
        }

        set({
          sprints: filteredSprints,
          loading: false,
        })
      },

      createSprint: async (sprintData) => {
        set({ loading: true })

        const newSprint: Sprint = {
          ...sprintData,
          id: Date.now().toString(),
          tasks: [],
        }

        set((state) => ({
          sprints: [...state.sprints, newSprint],
          loading: false,
        }))
      },

      updateSprint: async (id: string, updates: Partial<Sprint>) => {
        set((state) => ({
          sprints: state.sprints.map((sprint) => (sprint.id === id ? { ...sprint, ...updates } : sprint)),
          currentSprint: state.currentSprint?.id === id ? { ...state.currentSprint, ...updates } : state.currentSprint,
        }))
      },

      deleteSprint: async (id: string) => {
        set((state) => ({
          sprints: state.sprints.filter((sprint) => sprint.id !== id),
          currentSprint: state.currentSprint?.id === id ? null : state.currentSprint,
        }))
      },

      setCurrentSprint: (sprint: Sprint) => {
        set({ currentSprint: sprint })
      },

      addTaskToSprint: (sprintId: string, task: Task) => {
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId ? { ...sprint, tasks: [...sprint.tasks, task] } : sprint,
          ),
        }))
      },

      removeTaskFromSprint: (sprintId: string, taskId: string) => {
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === sprintId ? { ...sprint, tasks: sprint.tasks.filter((t) => t.id !== taskId) } : sprint,
          ),
        }))
      },
    }),
    {
      name: "sprint-storage",
    },
  ),
)
