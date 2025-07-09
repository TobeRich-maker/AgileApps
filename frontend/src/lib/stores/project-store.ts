import { makeAutoObservable, runInAction } from "mobx"
import type { Project, ProjectCreate, ProjectUpdate } from "@/types"
import { projectsApi } from "../api"
import { toast } from "sonner"

class ProjectStore {
  projects: Project[] = []
  isLoading = false
  constructor() {
    makeAutoObservable(this)
  }

  loadProjects = async () => {
    this.isLoading = true
    try {
      const projects = await projectsApi.getAll()
      runInAction(() => {
        this.projects = projects
      })
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  createProject = async (project: ProjectCreate) => {
    this.isLoading = true
    try {
      const newProject = await projectsApi.create(project)
      runInAction(() => {
        this.projects.push(newProject)
      })
      toast.success("Project created successfully")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  updateProject = async (id: string, project: ProjectUpdate) => {
    this.isLoading = true
    try {
      const updatedProject = await projectsApi.update(id, project)
      runInAction(() => {
        this.projects = this.projects.map((p) => (p.id === id ? updatedProject : p))
      })
      toast.success("Project updated successfully")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  deleteProject = async (id: string) => {
    this.isLoading = true
    try {
      await projectsApi.delete(id)
      runInAction(() => {
        this.projects = this.projects.filter((p) => p.id !== id)
      })
      toast.success("Project deleted successfully")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  getProject = (id: string): Project | undefined => {
    return this.projects.find((project) => project.id === id)
  }
}

export const projectStore = new ProjectStore()
