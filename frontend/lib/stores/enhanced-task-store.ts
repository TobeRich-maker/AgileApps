"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  assignee?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  creator?: {
    id: string
    name: string
    email: string
  }
}

interface TaskState {
  tasks: Task[]
  loading: boolean
  searchQuery: string
  statusFilter: string
  priorityFilter: string
  assigneeFilter: string
  fetchTasks: (filters?: any) => Promise<void>
  createTask: (task: Omit<Task, "id" | "created_at" | "creator_id">) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  moveTask: (id: string, newStatus: Task["status"]) => Promise<void>
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setPriorityFilter: (priority: string) => void
  setAssigneeFilter: (assignee: string) => void
  getFilteredTasks: () => Task[]
}

// Mock data with more comprehensive task examples
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design login page",
    description: "Create wireframes and mockups for the login page with modern UI/UX principles",
    status: "done",
    priority: "high",
    story_points: 3,
    project_id: "1",
    sprint_id: "1",
    assignee_id: "4",
    creator_id: "3",
    due_date: "2024-01-20",
    tags: ["design", "ui", "authentication"],
    created_at: "2024-01-15T10:00:00Z",
    assignee: {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    creator: {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
    },
  },
  {
    id: "2",
    title: "Implement user authentication",
    description: "Set up JWT authentication with login/logout functionality and session management",
    status: "in_progress",
    priority: "high",
    story_points: 8,
    project_id: "1",
    sprint_id: "2",
    assignee_id: "1",
    creator_id: "3",
    due_date: "2024-02-05",
    tags: ["backend", "auth", "security"],
    created_at: "2024-01-30T09:00:00Z",
    assignee: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    creator: {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
    },
  },
  {
    id: "3",
    title: "Create user dashboard",
    description: "Build the main dashboard interface for logged-in users with project overview",
    status: "todo",
    priority: "medium",
    story_points: 5,
    project_id: "1",
    sprint_id: "2",
    assignee_id: "1",
    creator_id: "3",
    due_date: "2024-02-10",
    tags: ["frontend", "dashboard", "react"],
    created_at: "2024-02-01T14:00:00Z",
    assignee: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    creator: {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
    },
  },
  {
    id: "4",
    title: "Setup database schema",
    description: "Design and implement the database schema for projects, tasks, and users",
    status: "done",
    priority: "high",
    story_points: 5,
    project_id: "1",
    sprint_id: "1",
    assignee_id: "1",
    creator_id: "3",
    due_date: "2024-01-18",
    tags: ["database", "backend", "schema"],
    created_at: "2024-01-15T11:00:00Z",
    assignee: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    creator: {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
    },
  },
  {
    id: "5",
    title: "Implement drag and drop for Kanban",
    description: "Add drag and drop functionality to the Kanban board for better task management",
    status: "todo",
    priority: "medium",
    story_points: 8,
    project_id: "1",
    sprint_id: "2",
    assignee_id: "1",
    creator_id: "2",
    due_date: "2024-02-12",
    tags: ["frontend", "kanban", "dnd"],
    created_at: "2024-02-02T10:00:00Z",
    assignee: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    creator: {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
    },
  },
]

export const useEnhancedTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: mockTasks,
      loading: false,
      searchQuery: "",
      statusFilter: "all",
      priorityFilter: "all",
      assigneeFilter: "all",

      fetchTasks: async (filters = {}) => {
        set({ loading: true })
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 300))
        set({ loading: false })
      },

      createTask: async (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          creator_id: "current-user", // Would come from auth
        }

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))
      },

      updateTask: async (id: string, updates: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
        }))
      },

      deleteTask: async (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      moveTask: async (id: string, newStatus: Task["status"]) => {
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task)),
        }))
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
      },

      setStatusFilter: (status: string) => {
        set({ statusFilter: status })
      },

      setPriorityFilter: (priority: string) => {
        set({ priorityFilter: priority })
      },

      setAssigneeFilter: (assignee: string) => {
        set({ assigneeFilter: assignee })
      },

      getFilteredTasks: () => {
        const { tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter } = get()

        return tasks.filter((task) => {
          const matchesSearch =
            !searchQuery ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())

          const matchesStatus = statusFilter === "all" || task.status === statusFilter
          const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
          const matchesAssignee = assigneeFilter === "all" || task.assignee_id === assigneeFilter

          return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
        })
      },
    }),
    {
      name: "enhanced-task-storage",
    },
  ),
)
