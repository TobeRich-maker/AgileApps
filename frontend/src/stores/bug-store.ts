import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/api";

interface Bug {
  id: string;
  title: string;
  description: string;
  steps_to_reproduce?: string[];
  expected_behavior?: string;
  actual_behavior?: string;
  severity: "low" | "medium" | "high" | "critical";
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "testing" | "resolved" | "closed";
  project_id: string;
  reporter_id: string;
  assignee_id?: string;
  sprint_id?: string;
  environment?: string;
  browser?: string;
  os?: string;
  attachments?: string[];
  resolved_at?: string;
  created_at: string;
  project?: any;
  reporter?: any;
  assignee?: any;
  sprint?: any;
}

interface BugState {
  bugs: Bug[];
  loading: boolean;
  searchQuery: string;
  statusFilter: string;
  severityFilter: string;
  fetchBugs: (filters?: any) => Promise<void>;
  createBug: (
    bug: Omit<Bug, "id" | "created_at" | "reporter_id">
  ) => Promise<void>;
  updateBug: (id: string, updates: Partial<Bug>) => Promise<void>;
  deleteBug: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setSeverityFilter: (severity: string) => void;
  getFilteredBugs: () => Bug[];
}

export const useBugStore = create<BugState>()(
  persist(
    (set, get) => ({
      bugs: [],
      loading: false,
      searchQuery: "",
      statusFilter: "all",
      severityFilter: "all",

      fetchBugs: async (filters = {}) => {
        try {
          set({ loading: true });
          const response = await api.get("/bugs", { params: filters });
          set({ bugs: response.data });
        } catch (error) {
          console.error("Failed to fetch bugs:", error);
        } finally {
          set({ loading: false });
        }
      },

      createBug: async (bugData) => {
        try {
          set({ loading: true });
          const response = await api.post("/bugs", bugData);
          set((state) => ({
            bugs: [...state.bugs, response.data],
          }));
        } catch (error) {
          console.error("Failed to create bug:", error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      updateBug: async (id: string, updates: Partial<Bug>) => {
        try {
          const response = await api.put(`/bugs/${id}`, updates);
          set((state) => ({
            bugs: state.bugs.map((bug) =>
              bug.id === id ? response.data : bug
            ),
          }));
        } catch (error) {
          console.error("Failed to update bug:", error);
          throw error;
        }
      },

      deleteBug: async (id: string) => {
        try {
          await api.delete(`/bugs/${id}`);
          set((state) => ({
            bugs: state.bugs.filter((bug) => bug.id !== id),
          }));
        } catch (error) {
          console.error("Failed to delete bug:", error);
          throw error;
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setStatusFilter: (status: string) => {
        set({ statusFilter: status });
      },

      setSeverityFilter: (severity: string) => {
        set({ severityFilter: severity });
      },

      getFilteredBugs: () => {
        const { bugs, searchQuery, statusFilter, severityFilter } = get();

        return bugs.filter((bug) => {
          const matchesSearch =
            !searchQuery ||
            bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bug.description.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesStatus =
            statusFilter === "all" || bug.status === statusFilter;
          const matchesSeverity =
            severityFilter === "all" || bug.severity === severityFilter;

          return matchesSearch && matchesStatus && matchesSeverity;
        });
      },
    }),
    {
      name: "bug-storage",
    }
  )
);
