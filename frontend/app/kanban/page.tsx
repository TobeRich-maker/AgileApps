"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { CreateTaskDialog } from "@/components/kanban/create-task-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useSprintStore,
  type Task,
  type TaskStatus,
} from "@/lib/stores/sprint-store";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function KanbanPage() {
  const { tasks, addTask, updateTask, deleteTask, setTasks } = useSprintStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState<TaskStatus>("To Do");
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const router = useRouter();

  // ✅ Cek autentikasi saat mount
  useEffect(() => {
    checkAuth().finally(() => setIsAuthChecked(true));
  }, [checkAuth]);

  // ✅ Redirect jika tidak login
  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthChecked, isAuthenticated, router]);

  // ✅ Load mock data (bisa diganti API)
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Design user authentication flow",
        description: "Create wireframes and mockups for login and registration",
        status: "To Do",
        priority: "High",
        storyPoints: 5,
        assigneeName: "John Doe",
        assigneeId: "user-1",
        sprintId: "sprint-1",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        title: "Implement login API",
        description: "Create backend endpoints for user authentication",
        status: "In Progress",
        priority: "Critical",
        storyPoints: 8,
        assigneeName: "Jane Smith",
        assigneeId: "user-2",
        sprintId: "sprint-1",
        createdAt: "2024-01-14T09:00:00Z",
        updatedAt: "2024-01-16T14:30:00Z",
      },
      {
        id: "3",
        title: "Setup project structure",
        description: "Initialize Next.js project with TypeScript and Tailwind",
        status: "Done",
        priority: "Medium",
        storyPoints: 3,
        assigneeName: "Mike Johnson",
        assigneeId: "user-3",
        sprintId: "sprint-1",
        createdAt: "2024-01-13T08:00:00Z",
        updatedAt: "2024-01-14T16:00:00Z",
      },
      {
        id: "4",
        title: "Create dashboard layout",
        description: "Build responsive dashboard with sidebar navigation",
        status: "To Do",
        priority: "Medium",
        storyPoints: 5,
        assigneeName: "Sarah Wilson",
        assigneeId: "user-4",
        sprintId: "sprint-1",
        createdAt: "2024-01-15T11:00:00Z",
        updatedAt: "2024-01-15T11:00:00Z",
      },
    ];

    if (tasks.length === 0) {
      setTasks(mockTasks);
    }
  }, [tasks.length, setTasks]);

  // ❌ Jangan render apapun sebelum auth check selesai
  if (!isAuthChecked) return null;

  // 🔧 Handler task
  const handleCreateTask = (status: TaskStatus) => {
    setInitialStatus(status);
    setEditingTask(undefined);
    setIsCreateDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsCreateDialogOpen(true);
  };

  const handleSubmitTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, {
        ...taskData,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addTask(newTask);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId);
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
            <p className="text-muted-foreground">
              Manage tasks and track progress across your sprint.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Sprint 23 Active
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <KanbanBoard
          onCreateTask={handleCreateTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />

        <CreateTaskDialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) setEditingTask(undefined);
          }}
          onSubmit={handleSubmitTask}
          initialStatus={initialStatus}
          task={editingTask}
        />
      </div>
    </MainLayout>
  );
}
