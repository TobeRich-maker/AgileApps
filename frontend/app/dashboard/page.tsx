"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

import { MainLayout } from "@/components/layout/main-layout";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { SprintProgress } from "@/components/dashboard/sprint-progress";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { VelocityChart } from "@/components/charts/velocity-chart";
import { difficultyDistributionData } from "@/lib/dummy/chart-data";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isAuthChecked, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthChecked, isAuthenticated, router]);

  // Data dummy sementara
  const [stats] = useState({
    totalProjects: 12,
    activeSprints: 3,
    completedTasks: 47,
    teamMembers: 8,
  });

  const [currentSprint] = useState({
    name: "Sprint 23",
    goal: "Implement user authentication and dashboard",
    progress: 65,
    daysLeft: 5,
    totalTasks: 12,
    completedTasks: 8,
  });

  const [activities] = useState([
    {
      id: "1",
      user: "John Doe",
      action: "completed task",
      target: "User Login Form",
      time: "2 hours ago",
      type: "task" as const,
    },
    {
      id: "2",
      user: "Jane Smith",
      action: "started sprint",
      target: "Sprint 24",
      time: "4 hours ago",
      type: "sprint" as const,
    },
    {
      id: "3",
      user: "Mike Johnson",
      action: "created project",
      target: "Mobile App",
      time: "1 day ago",
      type: "project" as const,
    },
  ]);

  const [velocityData] = useState([
    { sprint: "Sprint 19", planned: 25, completed: 23 },
    { sprint: "Sprint 20", planned: 30, completed: 28 },
    { sprint: "Sprint 21", planned: 28, completed: 30 },
    { sprint: "Sprint 22", planned: 32, completed: 29 },
    { sprint: "Sprint 23", planned: 35, completed: 33 },
  ]);

  // Tampilkan halaman kosong sementara nunggu checkAuth selesai
  if (!isAuthChecked) return null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>

        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SprintProgress sprint={currentSprint} />
          <RecentActivity activities={activities} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VelocityChart data={velocityData} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Project Difficulty Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={difficultyDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {difficultyDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {difficultyDistributionData.map((item) => (
                  <div
                    key={item.difficulty}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">
                      {item.difficulty}: {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
