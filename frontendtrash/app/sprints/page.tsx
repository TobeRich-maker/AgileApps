"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSprintStore, type Sprint } from "@/lib/stores/sprint-store";
import { DraggableSprintList } from "@/components/sprints/draggable-sprint-list";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function SprintsPage() {
  const { sprints, setSprints } = useSprintStore();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();

  // Cek autentikasi saat halaman dimuat
  useEffect(() => {
    checkAuth().finally(() => setIsAuthChecked(true));
  }, [checkAuth]);

  // Redirect jika tidak login
  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthChecked, isAuthenticated, router]);

  // Load data sprint
  useEffect(() => {
    const mockSprints: Sprint[] = [
      {
        id: "1",
        name: "Sprint 23",
        goal: "Implement user authentication and dashboard",
        startDate: "2024-01-15",
        endDate: "2024-01-29",
        status: "Active",
        storyPoints: 35,
        completedPoints: 23,
        projectId: "project-1",
        tasks: [],
      },
      {
        id: "2",
        name: "Sprint 22",
        goal: "Setup project infrastructure and basic components",
        startDate: "2024-01-01",
        endDate: "2024-01-14",
        status: "Completed",
        storyPoints: 28,
        completedPoints: 28,
        projectId: "project-1",
        tasks: [],
      },
      {
        id: "3",
        name: "Sprint 24",
        goal: "Build reporting features and data visualization",
        startDate: "2024-01-30",
        endDate: "2024-02-13",
        status: "Planned",
        storyPoints: 32,
        completedPoints: 0,
        projectId: "project-1",
        tasks: [],
      },
    ];

    if (sprints.length === 0) {
      setSprints(mockSprints);
    }
  }, [sprints.length, setSprints]);

  const handleReorderSprints = async (reorderedSprints: Sprint[]) => {
    try {
      setSprints(reorderedSprints);
    } catch (error) {
      console.error("Failed to reorder sprints:", error);
      setSprints(sprints);
    }
  };

  const handleEditSprint = (sprint: Sprint) => {
    console.log("Edit sprint:", sprint);
  };

  const handleDeleteSprint = async (sprintId: string) => {
    if (confirm("Are you sure you want to delete this sprint?")) {
      try {
        setSprints((prev) => prev.filter((s) => s.id !== sprintId));
      } catch (error) {
        console.error("Failed to delete sprint:", error);
      }
    }
  };

  const handleStartSprint = async (sprintId: string) => {
    try {
      setSprints((prev) =>
        prev.map((s) =>
          s.id === sprintId ? { ...s, status: "Active" as const } : s
        )
      );
    } catch (error) {
      console.error("Failed to start sprint:", error);
    }
  };

  const handleCompleteSprint = async (sprintId: string) => {
    try {
      setSprints((prev) =>
        prev.map((s) =>
          s.id === sprintId ? { ...s, status: "Completed" as const } : s
        )
      );
    } catch (error) {
      console.error("Failed to complete sprint:", error);
    }
  };

  // Jangan render apapun sebelum cek auth selesai
  if (!isAuthChecked) return null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sprints</h1>
            <p className="text-muted-foreground">
              Plan and manage your development sprints.
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            New Sprint
          </Button>
        </div>

        <DraggableSprintList
          sprints={sprints}
          onReorder={handleReorderSprints}
          onEdit={handleEditSprint}
          onDelete={handleDeleteSprint}
          onStart={handleStartSprint}
          onComplete={handleCompleteSprint}
        />

        {sprints.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sprints found.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
