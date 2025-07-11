import { create } from "zustand";

export type SprintStatus = "Planned" | "Active" | "Completed";

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  storyPoints: number;
  completedPoints: number;
  projectId: string;
  tasks: Task[];
}

export type TaskStatus = "To Do" | "In Progress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints: number;
  assigneeId?: string;
  assigneeName?: string;
  sprintId: string;
  createdAt: string;
  updatedAt: string;
}

interface SprintState {
  sprints: Sprint[];
  currentSprint: Sprint | null;
  tasks: Task[];
  setSprints: (sprints: Sprint[]) => void;
  setCurrentSprint: (sprint: Sprint | null) => void;
  setTasks: (tasks: Task[]) => void;
  addSprint: (sprint: Sprint) => void;
  updateSprint: (id: string, updates: Partial<Sprint>) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
}

export const useSprintStore = create<SprintState>((set, get) => ({
  sprints: [],
  currentSprint: null,
  tasks: [],
  setSprints: (sprints) => set({ sprints }),
  setCurrentSprint: (sprint) => set({ currentSprint: sprint }),
  setTasks: (tasks) => set({ tasks }),
  addSprint: (sprint) => {
    set({ sprints: [...get().sprints, sprint] });
  },
  updateSprint: (id, updates) => {
    set({
      sprints: get().sprints.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    });
  },
  addTask: (task) => {
    set({ tasks: [...get().tasks, task] });
  },
  updateTask: (id, updates) => {
    set({
      tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    });
  },
  deleteTask: (id) => {
    set({
      tasks: get().tasks.filter((t) => t.id !== id),
    });
  },
  moveTask: (taskId, newStatus) => {
    set({
      tasks: get().tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
          : t,
      ),
    });
  },
}));
