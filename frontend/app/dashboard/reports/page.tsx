"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BurndownChart } from "@/components/charts/burndown-chart";
import { VelocityChart } from "@/components/charts/velocity-chart";
import { TaskDistributionChart } from "@/components/charts/task-distribution-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Download, Calendar } from "lucide-react";

export default function ReportsPage() {
  const [selectedSprint, setSelectedSprint] = useState("current");
  const [selectedProject, setSelectedProject] = useState("all");

  const sprintMetrics = {
    totalStoryPoints: 45,
    completedStoryPoints: 32,
    remainingStoryPoints: 13,
    velocity: 28,
    burndownRate: "On Track",
    completionRate: 71,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sprint Reports</h1>
            <p className="text-gray-600 mt-1">
              Track performance and analyze team productivity
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <Select value={selectedSprint} onValueChange={setSelectedSprint}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Sprint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Sprint</SelectItem>
              <SelectItem value="sprint-1">Sprint 1</SelectItem>
              <SelectItem value="sprint-2">Sprint 2</SelectItem>
              <SelectItem value="sprint-3">Sprint 3</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="1">E-commerce Platform</SelectItem>
              <SelectItem value="2">Mobile App</SelectItem>
              <SelectItem value="3">Dashboard Redesign</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Story Points
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sprintMetrics.completedStoryPoints}/
                {sprintMetrics.totalStoryPoints}
              </div>
              <p className="text-xs text-muted-foreground">
                {sprintMetrics.completionRate}% completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Velocity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sprintMetrics.velocity}</div>
              <p className="text-xs text-muted-foreground">Points per sprint</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Burndown</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant="default">On Track</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Sprint progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sprintMetrics.remainingStoryPoints}
              </div>
              <p className="text-xs text-muted-foreground">Story points left</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Burndown Chart</CardTitle>
              <CardDescription>Track remaining work over time</CardDescription>
            </CardHeader>
            <CardContent>
              <BurndownChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Velocity Chart</CardTitle>
              <CardDescription>
                Team velocity over recent sprints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VelocityChart />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>
              Breakdown of tasks by status and assignee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskDistributionChart />
          </CardContent>
        </Card>

        {/* Sprint Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Summary</CardTitle>
            <CardDescription>
              Key achievements and insights from the current sprint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Achievements</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Completed user authentication system</li>
                  <li>Implemented responsive dashboard layout</li>
                  <li>Fixed 8 critical bugs</li>
                  <li>Added real-time notifications</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Challenges</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>API integration took longer than expected</li>
                  <li>Performance optimization needed more time</li>
                  <li>Team member was unavailable for 2 days</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Next Sprint Focus</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Complete remaining API endpoints</li>
                  <li>Implement advanced search functionality</li>
                  <li>Add comprehensive testing suite</li>
                  <li>Optimize database queries</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
