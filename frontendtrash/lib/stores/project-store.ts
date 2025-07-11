import { create } from "zustand";
import { projectsApi } from "@/lib/api/projects";
import type { Project } from "@/lib/types/api";

console.log("🔥 Initializing Project Store...");
interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  fetchProjects: () => Promise<void>;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,

  addProject: (project) => {
    set({ projects: [...get().projects, project] });
  },

  updateProject: (id, updates) => {
    set({
      projects: get().projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    });
  },

  deleteProject: (id) => {
    set({
      projects: get().projects.filter((p) => p.id !== id),
    });
  },

  fetchProjects: async () => {
    console.log("📥 Fetching projects...");
    try {
      const response = await projectsApi.getAll();
      const projectsFromApi = response.data.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        description: p.description,
        status: p.status,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        teamMembers: p.members?.map((m: any) => m.name) ?? [],
        sprintCount: p.sprints?.length ?? 0,
        difficulty: "Medium",
      }));
      set({ projects: projectsFromApi });
      console.log("✅ Projects fetched:", projectsFromApi);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  },
}));
