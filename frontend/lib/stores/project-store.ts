import { create } from "zustand"

export type ProjectStatus = "Active" | "Completed" | "On Hold"

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  teamMembers: string[]
  sprintCount: number
}

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  setProjects: (projects: Project[]) => void
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) => {
    set({ projects: [...get().projects, project] })
  },
  updateProject: (id, updates) => {
    set({
      projects: get().projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })
  },
  deleteProject: (id) => {
    set({
      projects: get().projects.filter((p) => p.id !== id),
    })
  },
}))
