"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Pin,
  PinOff,
  Calendar,
  Flag,
  Clock,
  CheckCircle2,
  Circle,
  Filter,
  SortAsc,
  Target,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types/api";
// === Mocked Data ===
const mockUserTasks: Task[] = [
  {
    id: "1",
    title: "User Authentication Form",
    description: "Create login and registration forms with validation",
    status: "In Progress",
    priority: "High",
    storyPoints: 8,
    assigneeId: "current-user",
    assignee: {
      id: "current-user",
      name: "You",
      email: "you@example.com",
      role: "Developer",
      createdAt: "",
      updatedAt: "",
    },
    sprintId: "sprint-23",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    dueDate: "2024-01-25T23:59:59Z",
  },
  {
    id: "2",
    title: "Dashboard Layout",
    description: "Design and implement the main dashboard layout",
    status: "To Do",
    priority: "Medium",
    storyPoints: 5,
    assigneeId: "current-user",
    assignee: {
      id: "current-user",
      name: "You",
      email: "you@example.com",
      role: "Developer",
      createdAt: "",
      updatedAt: "",
    },
    sprintId: "sprint-23",
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T09:00:00Z",
    dueDate: "2024-01-28T23:59:59Z",
  },
  {
    id: "3",
    title: "API Integration",
    description: "Connect frontend with backend API endpoints",
    status: "Done",
    priority: "High",
    storyPoints: 13,
    assigneeId: "current-user",
    assignee: {
      id: "current-user",
      name: "You",
      email: "you@example.com",
      role: "Developer",
      createdAt: "",
      updatedAt: "",
    },
    sprintId: "sprint-22",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-18T16:00:00Z",
    dueDate: "2024-01-20T23:59:59Z",
  },
];

// === Types ===
type SortOption = "dueDate" | "priority" | "status" | "storyPoints";
type FilterOption = "all" | "todo" | "inprogress" | "done";

export default function MyWorkPage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockUserTasks);
  const [pinnedTasks, setPinnedTasks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  // === Authentication Check ===
  useEffect(() => {
    checkAuth().finally(() => setIsAuthChecked(true));
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthChecked, isAuthenticated, router]);
  //End Authentication Check

  // === Load Pinned from localStorage ===
  useEffect(() => {
    if (!isAuthChecked) return;
    const saved = localStorage.getItem("pinnedTasks");
    if (saved) setPinnedTasks(JSON.parse(saved));
  }, [isAuthChecked]);

  const togglePin = (taskId: string) => {
    const updated = pinnedTasks.includes(taskId)
      ? pinnedTasks.filter((id) => id !== taskId)
      : [...pinnedTasks, taskId];

    setPinnedTasks(updated);
    localStorage.setItem("pinnedTasks", JSON.stringify(updated));
  };

  // === Filter & Sort Tasks ===
  const filteredAndSortedTasks = useMemo(() => {
    if (!isAuthChecked) return [];

    const filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "todo" && task.status === "To Do") ||
        (filterBy === "inprogress" && task.status === "In Progress") ||
        (filterBy === "done" && task.status === "Done");
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return (
            new Date(a.dueDate || "").getTime() -
            new Date(b.dueDate || "").getTime()
          );
        case "priority":
          const priorityMap = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          return (
            (priorityMap[b.priority as keyof typeof priorityMap] ?? 0) -
            (priorityMap[a.priority as keyof typeof priorityMap] ?? 0)
          );
        case "status":
          const statusMap = { "To Do": 1, "In Progress": 2, Done: 3 };
          return (
            (statusMap[a.status as keyof typeof statusMap] ?? 0) -
            (statusMap[b.status as keyof typeof statusMap] ?? 0)
          );
        case "storyPoints":
          return b.storyPoints - a.storyPoints;
        default:
          return 0;
      }
    });

    return filtered;
  }, [isAuthChecked, tasks, searchQuery, sortBy, filterBy]);

  const pinnedTasksList = filteredAndSortedTasks.filter((t) =>
    pinnedTasks.includes(t.id)
  );
  const unpinnedTasksList = filteredAndSortedTasks.filter(
    (t) => !pinnedTasks.includes(t.id)
  );

  // === Stats Calculation ===
  const stats = useMemo(() => {
    if (!isAuthChecked)
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        totalPoints: 0,
        completedPoints: 0,
        completionRate: 0,
        pointsProgress: 0,
      };

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Done").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const todo = tasks.filter((t) => t.status === "To Do").length;
    const totalPoints = tasks.reduce((acc, t) => acc + t.storyPoints, 0);
    const completedPoints = tasks
      .filter((t) => t.status === "Done")
      .reduce((acc, t) => acc + t.storyPoints, 0);

    return {
      total,
      completed,
      inProgress,
      todo,
      totalPoints,
      completedPoints,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
      pointsProgress: totalPoints
        ? Math.round((completedPoints / totalPoints) * 100)
        : 0,
    };
  }, [isAuthChecked, tasks]);

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) =>
    status === "Done"
      ? "bg-green-100 dark:bg-green-900 dark:text-green-200"
      : status === "In Progress"
      ? "bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
      : "bg-slate-100 dark:bg-slate-800";

  const getPriorityColor = (priority: string) =>
    priority === "Critical"
      ? "bg-red-100 dark:bg-red-900 dark:text-red-200"
      : priority === "High"
      ? "bg-orange-100 dark:bg-orange-900 dark:text-orange-200"
      : priority === "Medium"
      ? "bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200"
      : "bg-green-100 dark:bg-green-900 dark:text-green-200";

  if (!isAuthChecked) return null;

  const TaskCard = ({ task, isPinned }: { task: Task; isPinned: boolean }) => {
    const daysUntilDue = getDaysUntilDue(task.dueDate);

    return (
      <Card className="card-hover">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-navy-900 dark:text-navy-100 truncate">
                {task.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {task.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => togglePin(task.id)}
              className="ml-2 flex-shrink-0"
            >
              {isPinned ? (
                <Pin className="h-4 w-4 text-amber-500" />
              ) : (
                <PinOff className="h-4 w-4 text-slate-400" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Badge className={getStatusColor(task.status)}>
              {task.status === "Done" ? (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              ) : (
                <Circle className="h-3 w-3 mr-1" />
              )}
              {task.status}
            </Badge>
            <Badge
              variant="outline"
              className={getPriorityColor(task.priority)}
            >
              <Flag className="h-3 w-3 mr-1" />
              {task.priority}
            </Badge>
            <Badge variant="secondary">{task.storyPoints} pts</Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">
                    {task.assignee?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{task.assignee?.name}</span>
              </div>
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span
                  className={cn(
                    daysUntilDue !== null && daysUntilDue < 0
                      ? "text-red-600 dark:text-red-400"
                      : daysUntilDue !== null && daysUntilDue <= 2
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-slate-600 dark:text-slate-400"
                  )}
                >
                  {daysUntilDue !== null && daysUntilDue === 0
                    ? "Due today"
                    : daysUntilDue !== null && daysUntilDue < 0
                    ? `${Math.abs(daysUntilDue)}d overdue`
                    : daysUntilDue !== null
                    ? `${daysUntilDue}d left`
                    : "No due date"}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy-900 dark:text-navy-100">
              My Work
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Focus on your assigned tasks and track your progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-navy-100 text-navy-800 dark:bg-navy-800 dark:text-navy-200"
            >
              <Target className="h-3 w-3 mr-1" />
              {stats.completionRate}% Complete
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-navy-900 dark:text-navy-100">
                    {stats.total}
                  </p>
                </div>
                <div className="p-2 bg-navy-100 dark:bg-navy-800 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-navy-600 dark:text-navy-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.inProgress}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.completed}
                  </p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Story Points
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.completedPoints}/{stats.totalPoints}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <Progress value={stats.pointsProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select
                  value={filterBy}
                  onValueChange={(value: FilterOption) => setFilterBy(value)}
                >
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={(value: SortOption) => setSortBy(value)}
                >
                  <SelectTrigger className="w-32">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="storyPoints">Story Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All Tasks ({filteredAndSortedTasks.length})
            </TabsTrigger>
            <TabsTrigger value="pinned">
              Pinned ({pinnedTasksList.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {pinnedTasksList.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-navy-900 dark:text-navy-100 mb-3 flex items-center gap-2">
                  <Pin className="h-5 w-5 text-amber-500" />
                  Pinned Tasks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {pinnedTasksList.map((task) => (
                    <TaskCard key={task.id} task={task} isPinned={true} />
                  ))}
                </div>
              </div>
            )}

            {unpinnedTasksList.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-navy-900 dark:text-navy-100 mb-3">
                  Other Tasks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unpinnedTasksList.map((task) => (
                    <TaskCard key={task.id} task={task} isPinned={false} />
                  ))}
                </div>
              </div>
            )}

            {filteredAndSortedTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No tasks found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "You're all caught up!"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pinned" className="space-y-4">
            {pinnedTasksList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedTasksList.map((task) => (
                  <TaskCard key={task.id} task={task} isPinned={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Pin className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No pinned tasks
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Pin important tasks to keep them at the top of your list
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
