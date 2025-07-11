import { create } from "zustand";
import api from "@/lib/axios";

export type ProjectStatus = "active" | "completed" | "on_hold";
export type ProjectDifficulty = "Easy" | "Medium" | "Hard" | "Extreme";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  difficulty?: ProjectDifficulty;
  start_date?: string;
  end_date?: string;
  createdAt?: string;
  updatedAt?: string;
  sprintCount?: number;
  teamMembers: string[]; // array of member names or objects if you want
}

interface ProjectState {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  fetchProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],

  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),

  updateProject: (id, updated) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updated } : p
      ),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),

  fetchProjects: async () => {
    try {
      const response = await api.get("/projects");
      const projects = response.data.map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        description: p.description,
        status: p.status === "on_hold" ? "on_hold" : capitalize(p.status),
        difficulty: p.difficulty ?? "Medium",
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        sprintCount: p.sprints?.length ?? 0,
        teamMembers: p.members?.map((m: any) => m.name) ?? [],
      }));

      set({ projects });
    } catch (err) {
      console.error("❌ Failed to fetch projects", err);
    }
  },
}));

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
