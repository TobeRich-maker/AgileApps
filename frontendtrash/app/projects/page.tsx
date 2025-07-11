"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { ProjectCard } from "@/components/projects/project-card";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjectStore } from "@/lib/stores/project-store";
import type { Project } from "@/lib/types/api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProjectDifficulty } from "@/lib/types/api";

export default function ProjectsPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { projects, addProject, updateProject, deleteProject, fetchProjects } =
    useProjectStore((state) => ({
      projects: state.projects,
      addProject: state.addProject,
      updateProject: state.updateProject,
      deleteProject: state.deleteProject,
      fetchProjects: state.fetchProjects,
    }));

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    checkAuth().finally(() => setIsAuthChecked(true));
  }, [checkAuth]);
  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthChecked, isAuthenticated, router]);
  console.log("Halaman disini");
  useEffect(() => {
    if (!isAuthChecked || !isAuthenticated) return;

    setIsLoading(true);
    fetchProjects()
      .then(() => {
        console.log("📦 Projects fetched successfully");
      })
      .catch((error) => {
        console.error("❌ Failed to fetch projects:", error);
      })
      .finally(() => setIsLoading(false));
  }, [isAuthChecked, isAuthenticated, fetchProjects]);

  if (isLoading || !isAuthChecked) {
    return <p className="p-4">Loading projects...</p>;
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || project.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleCreateProject = (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addProject(newProject);
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
