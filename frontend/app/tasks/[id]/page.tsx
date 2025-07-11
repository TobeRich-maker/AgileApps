"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { TaskComments } from "@/components/tasks/task-comments";
import { TaskChecklist } from "@/components/tasks/task-checklist";
import { ArrowLeft, Calendar, User, Flag, Clock, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface TaskDetailProps {
  params: { id: string };
}

// Mock task data
const mockTask = {
  id: "1",
  title: "User Authentication Form",
  description:
    "Create a comprehensive user authentication form with login, registration, and password reset functionality. The form should include proper validation, error handling, and responsive design.",
  status: "In Progress",
  priority: "High",
  storyPoints: 8,
  assignee: {
    id: "user-1",
    name: "John Doe",
    avatar: "",
  },
  reporter: {
    id: "user-2",
    name: "Jane Smith",
    avatar: "",
  },
  project: {
    id: "project-1",
    name: "E-commerce Platform",
  },
  sprint: {
    id: "sprint-23",
    name: "Sprint 23",
  },
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T14:30:00Z",
  dueDate: "2024-01-25T23:59:59Z",
};

export default function TaskDetailPage({ params }: TaskDetailProps) {
  const router = useRouter();
  const [task, setTask] = useState(mockTask);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-100 text-gray-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(task.dueDate);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>{task.project.name}</span>
              <span>•</span>
              <span>{task.sprint.name}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          </div>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Task
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Task Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.description}
                </p>
              </CardContent>
            </Card>

            {/* Task Checklist */}
            <TaskChecklist taskId={task.id} />

            {/* Comments */}
            <TaskComments taskId={task.id} />
          </div>

          <div className="space-y-6">
            {/* Task Details */}
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Priority
                  </span>
                  <Badge
                    className={getPriorityColor(task.priority)}
                    variant="outline"
                  >
                    <Flag className="h-3 w-3 mr-1" />
                    {task.priority}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Story Points
                  </span>
                  <Badge variant="secondary">{task.storyPoints} pts</Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">
                        Assignee
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {task.assignee.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {task.assignee.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">
                        Reporter
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {task.reporter.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {task.reporter.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">
                        Due Date
                      </div>
                      <div className="text-sm font-medium">
                        {formatDate(task.dueDate)}
                      </div>
                      {daysUntilDue > 0 ? (
                        <div className="text-xs text-green-600">
                          {daysUntilDue} days remaining
                        </div>
                      ) : daysUntilDue === 0 ? (
                        <div className="text-xs text-orange-600">Due today</div>
                      ) : (
                        <div className="text-xs text-red-600">
                          {Math.abs(daysUntilDue)} days overdue
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">
                        Created
                      </div>
                      <div className="text-sm">
                        {formatDate(task.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">
                        Last Updated
                      </div>
                      <div className="text-sm">
                        {formatDate(task.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
