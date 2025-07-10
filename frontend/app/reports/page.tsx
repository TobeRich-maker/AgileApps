"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { VelocityChart } from "@/components/charts/velocity-chart";
import { BurndownChart } from "@/components/charts/burndown-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { PieChartIcon, TrendingUp, Users } from "lucide-react";
import { withAuthProtection } from "@/lib/hoc/withAuthProtection";

function ReportsPage() {
  const [velocityData] = useState([
    { sprint: "Sprint 19", planned: 25, completed: 23 },
    { sprint: "Sprint 20", planned: 30, completed: 28 },
    { sprint: "Sprint 21", planned: 28, completed: 30 },
    { sprint: "Sprint 22", planned: 32, completed: 29 },
    { sprint: "Sprint 23", planned: 35, completed: 33 },
  ]);

  const [burndownData] = useState([
    { day: "Day 1", ideal: 35, actual: 35 },
    { day: "Day 2", ideal: 32, actual: 33 },
    { day: "Day 3", ideal: 29, actual: 30 },
    { day: "Day 4", ideal: 26, actual: 28 },
    { day: "Day 5", ideal: 23, actual: 25 },
    { day: "Day 6", ideal: 20, actual: 22 },
    { day: "Day 7", ideal: 17, actual: 18 },
    { day: "Day 8", ideal: 14, actual: 15 },
    { day: "Day 9", ideal: 11, actual: 12 },
    { day: "Day 10", ideal: 8, actual: 8 },
  ]);

  const [taskDistribution] = useState([
    { name: "To Do", value: 8, color: "#94a3b8" },
    { name: "In Progress", value: 5, color: "#3b82f6" },
    { name: "Done", value: 12, color: "#16a34a" },
  ]);

  const [teamPerformance] = useState([
    { name: "John Doe", completed: 12, assigned: 15 },
    { name: "Jane Smith", completed: 10, assigned: 12 },
    { name: "Mike Johnson", completed: 8, assigned: 10 },
    { name: "Sarah Wilson", completed: 6, assigned: 8 },
  ]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Track team performance and project progress with detailed insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VelocityChart data={velocityData} />
          <BurndownChart data={burndownData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-green-600" />
                Task Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={taskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {taskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={teamPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#16a34a" name="Completed" />
                  <Bar dataKey="assigned" fill="#94a3b8" name="Assigned" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Velocity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28.6</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sprint Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 mt-2"
              >
                Excellent
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Team Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+5% from last sprint</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
export default withAuthProtection(ReportsPage);
