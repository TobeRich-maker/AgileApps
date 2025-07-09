"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle,
  Clock,
  Users,
  Target,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useSprintStore } from "@/lib/stores/sprint-store";
import { useEnhancedTaskStore } from "@/lib/stores/enhanced-task-store";
import { useAuthStore } from "@/lib/stores/auth-store";

export function EnhancedDashboard() {
  const { user } = useAuthStore();
  const { currentSprint } = useSprintStore();
  const { getFilteredTasks } = useEnhancedTaskStore();

  const allTasks = getFilteredTasks();
  const todoTasks = allTasks.filter((t) => t.status === "todo");
  const inProgressTasks = allTasks.filter((t) => t.status === "in_progress");
  const doneTasks = allTasks.filter((t) => t.status === "done");

  const completionRate =
    allTasks.length > 0 ? (doneTasks.length / allTasks.length) * 100 : 0;
  const sprintProgress = currentSprint
    ? (currentSprint.story_points_completed /
        currentSprint.story_points_planned) *
      100
    : 0;

  const recentTasks = allTasks
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your projects today.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Quick Add
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {doneTasks.length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            <p className="text-xs text-muted-foreground">Active tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completionRate.toFixed(1)}%
            </div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sprint Progress
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sprintProgress.toFixed(1)}%
            </div>
            <Progress value={sprintProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Sprint */}
        {currentSprint && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Current Sprint
              </CardTitle>
              <CardDescription>{currentSprint.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Sprint Goal</p>
                <p className="text-sm text-gray-600">{currentSprint.goal}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Story Points</span>
                <span className="font-medium">
                  {currentSprint.story_points_completed} /{" "}
                  {currentSprint.story_points_planned}
                </span>
              </div>

              <Progress value={sprintProgress} />

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {new Date(currentSprint.start_date).toLocaleDateString()} -
                  {new Date(currentSprint.end_date).toLocaleDateString()}
                </span>
                <Badge
                  variant={
                    currentSprint.status === "active" ? "default" : "secondary"
                  }
                >
                  {currentSprint.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recent Tasks
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.status === "done"
                        ? "bg-green-500"
                        : task.status === "in_progress"
                        ? "bg-blue-500"
                        : "bg-gray-400"
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {task.story_points}pt
                      </span>
                    </div>
                  </div>

                  {task.assignee && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={task.assignee.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-xs">
                        {task.assignee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to help you stay productive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-transparent"
            >
              <Plus className="h-5 w-5" />
              <span>Create Task</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-transparent"
            >
              <Calendar className="h-5 w-5" />
              <span>Plan Sprint</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 bg-transparent"
            >
              <Users className="h-5 w-5" />
              <span>Team Standup</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
