"use client"

import { create } from "zustand"
import { tasksApi } from "../api"

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
  project?: any
  sprint?: any
}

interface TaskState {
  tasks: Task[]
  loading: boolean
  fetchTasks: (filters?: any) => Promise<void>
  createTask: (task: Omit<Task, "id" | "created_at" | "creator_id">) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  moveTask: (id: string, newStatus: Task["status"]) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async (filters = {}) => {
    try {
      set({ loading: true })
      const response = await tasksApi.getAll(filters)
      set({ tasks: response.data })
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      set({ loading: false })
    }
  },

  createTask: async (taskData) => {
    try {
      set({ loading: true })
      const response = await tasksApi.create(taskData)
      set((state) => ({
        tasks: [...state.tasks, response.data],
      }))
    } catch (error) {
      console.error("Failed to create task:", error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    try {
      const response = await tasksApi.update(id, updates)
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? response.data : task)),
      }))
    } catch (error) {
      console.error("Failed to update task:", error)
      throw error
    }
  },

  deleteTask: async (id: string) => {
    try {
      await tasksApi.delete(id)
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }))
    } catch (error) {
      console.error("Failed to delete task:", error)
      throw error
    }
  },

  moveTask: async (id: string, newStatus: Task["status"]) => {
    try {
      const response = await tasksApi.updateStatus(id, newStatus)
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task)),
      }))
    } catch (error) {
      console.error("Failed to move task:", error)
      throw error
    }
  },
}))
