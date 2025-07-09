"use client";

import { create } from "zustand";
import { projectsApi, sprintsApi } from "@/lib/api";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on_hold";
  created_at: string;
  start_date?: string;
  end_date?: string;
  owner_id: string;
  owner?: any;
  members?: any[];
}

interface Sprint {
  id: string;
  name: string;
  goal: string;
  start_date: string;
  end_date: string;
  status: "planned" | "active" | "completed";
  project_id: string;
  story_points_planned: number;
  story_points_completed: number;
  tasks?: any[];
}

interface ProjectState {
  projects: Project[];
  currentSprint: Sprint | null;
  loading: boolean;
  fetchProjects: () => Promise<void>;
  fetchCurrentSprint: () => Promise<void>;
  createProject: (
    project: Omit<Project, "id" | "created_at" | "owner_id">
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentSprint: null,
  loading: false,

  fetchProjects: async () => {
    try {
      set({ loading: true });
      const response = await projectsApi.getAll();
      set({ projects: response.data });
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchCurrentSprint: async () => {
    try {
      const response = await sprintsApi.getCurrent();
      set({ currentSprint: response.data });
    } catch (error) {
      console.error("Failed to fetch current sprint:", error);
    }
  },

  createProject: async (projectData) => {
    try {
      set({ loading: true });
      const response = await projectsApi.create(projectData);
      set((state) => ({
        projects: [...state.projects, response.data],
      }));
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteProject: async (id: string) => {
    try {
      await projectsApi.delete(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  },
}));
