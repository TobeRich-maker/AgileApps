"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useSprintStore } from "@/lib/stores/sprint-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreateSprintDialog } from "@/components/sprints/create-sprint-dialog";
import { Plus, Calendar, Clock, Target, TrendingUp } from "lucide-react";

export default function SprintsPage() {
  const { sprints, fetchSprints } = useSprintStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "planned":
        return "outline";
      default:
        return "outline";
    }
  };

  const calculateProgress = (sprint: any) => {
    if (!sprint.tasks || sprint.tasks.length === 0) return 0;
    const completedTasks = sprint.tasks.filter(
      (task: any) => task.status === "done"
    ).length;
    return (completedTasks / sprint.tasks.length) * 100;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Sprint Management
            </h1>
            <p className="text-gray-600 mt-1">
              Plan, track, and manage your development sprints
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Sprint
          </Button>
        </div>

        {/* Active Sprint */}
        {sprints.find((s) => s.status === "active") && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-900">
                    Current Sprinttt
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    {sprints.find((s) => s.status === "active")?.name}
                  </CardDescription>
                </div>
                <Badge className="bg-blue-600">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-blue-700">
                    <Calendar className="h-4 w-4 mr-1" />
                    Duration
                  </div>
                  <p className="font-medium">2 weeks (5 days remaining)</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-blue-700">
                    <Target className="h-4 w-4 mr-1" />
                    Progress
                  </div>
                  <div className="space-y-1">
                    <Progress value={65} className="w-full" />
                    <p className="text-sm text-blue-600">
                      13/20 tasks completed
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-blue-700">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Velocity
                  </div>
                  <p className="font-medium">32 story points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Sprints */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sprints.map((sprint) => (
            <Card key={sprint.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{sprint.name}</CardTitle>
                    <CardDescription>{sprint.goal}</CardDescription>
                  </div>
                  <Badge variant={getStatusColor(sprint.status)}>
                    {sprint.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(sprint.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{sprint.duration} days</span>
                    </div>
                  </div>

                  {sprint.status === "active" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(calculateProgress(sprint))}%</span>
                      </div>
                      <Progress value={calculateProgress(sprint)} />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{sprint.tasks?.length || 0} tasks</span>
                    <span>{sprint.story_points || 0} story points</span>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    View Sprint
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sprints.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sprints yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first sprint to start planning your development
                cycle
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Sprint
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateSprintDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </DashboardLayout>
  );
}
