"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ProjectCard } from "@/components/projects/project-card";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjectStore, type Project } from "@/lib/stores/project-store";
import { Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProjectDifficulty } from "@/lib/types/api";
import api from "@/lib/axios"; // pastikan kamu mengimpor api
export default function ProjectsPage() {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    fetchProjects, // pastikan ini tersedia dari project-store.ts
  } = useProjectStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, [projects.length, fetchProjects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || project.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });
  function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const handleCreateProject = async (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const payload = {
        ...projectData,
        status: projectData.status.toLowerCase().replace(" ", "_"),
      };

      const response = await api.post("/projects", payload);

      const created = response.data;

      const newProject: Project = {
        id: created.id.toString(),
        name: created.name,
        description: created.description,
        status:
          created.status === "on_hold" ? "On Hold" : capitalize(created.status),
        difficulty: created.difficulty ?? "Medium",
        createdAt: created.created_at,
        updatedAt: created.updated_at,
        sprintCount: created.sprints?.length ?? 0,
        teamMembers: created.members?.map((m: any) => m.name) ?? [],
      };

      addProject(newProject);
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      if (error.response) {
        console.error("🧨 Server responded with:", error.response.data);
        alert(
          "Gagal membuat project: " +
            JSON.stringify(error.response.data.errors ?? error.response.data)
        );
      } else if (error.request) {
        console.error("🛰️ No response received:", error.request);
        alert("Gagal membuat project: No response from server");
      } else {
        console.error("🐞 Error setting up request:", error.message);
        alert("Gagal membuat project: " + error.message);
      }
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsCreateDialogOpen(true);
  };

  const handleUpdateProject = (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingProject) {
      updateProject(editingProject.id, {
        ...projectData,
        updatedAt: new Date().toISOString(),
      });
      setEditingProject(undefined);
    }
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
    }
  };

  const handleViewProject = (project: Project) => {
    console.log("Viewing project:", project);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-muted-foreground">
              Manage your projects and track their progress.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
              <SelectItem value="Extreme">Extreme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onView={handleViewProject}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found.</p>
          </div>
        )}

        <CreateProjectDialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) setEditingProject(undefined);
          }}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          project={editingProject}
        />
      </div>
    </MainLayout>
  );
}
