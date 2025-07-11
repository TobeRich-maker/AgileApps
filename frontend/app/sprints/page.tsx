"use client";

import { useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { useSprintStore, type Sprint } from "@/lib/stores/sprint-store";
import { Plus } from "lucide-react";
import { DraggableSprintList } from "@/components/sprints/draggable-sprint-list";

export default function SprintsPage() {
  const { sprints, setSprints } = useSprintStore();

  useEffect(() => {
    // Mock data - replace with actual API call
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Planned":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleReorderSprints = async (reorderedSprints: Sprint[]) => {
    try {
      // Update local state immediately for optimistic UI
      setSprints(reorderedSprints);

      // In real app, send to API
      // const updates = reorderedSprints.map((sprint, index) => ({
      //   sprintId: sprint.id,
      //   newOrder: index
      // }))
      // await sprintsApi.updateOrder(updates)
    } catch (error) {
      console.error("Failed to reorder sprints:", error);
      // Revert on error
      setSprints(sprints);
    }
  };

  const handleEditSprint = (sprint: Sprint) => {
    console.log("Edit sprint:", sprint);
    // Implement edit functionality
  };

  const handleDeleteSprint = async (sprintId: string) => {
    if (confirm("Are you sure you want to delete this sprint?")) {
      try {
        // await sprintsApi.delete(sprintId)
        setSprints((prev) => prev.filter((s) => s.id !== sprintId));
      } catch (error) {
        console.error("Failed to delete sprint:", error);
      }
    }
  };

  const handleStartSprint = async (sprintId: string) => {
    try {
      // await sprintsApi.start(sprintId)
      setSprints((prev) =>
        prev.map((s) =>
          s.id === sprintId ? { ...s, status: "Active" as const } : s,
        ),
      );
    } catch (error) {
      console.error("Failed to start sprint:", error);
    }
  };

  const handleCompleteSprint = async (sprintId: string) => {
    try {
      // await sprintsApi.complete(sprintId)
      setSprints((prev) =>
        prev.map((s) =>
          s.id === sprintId ? { ...s, status: "Completed" as const } : s,
        ),
      );
    } catch (error) {
      console.error("Failed to complete sprint:", error);
    }
  };

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
