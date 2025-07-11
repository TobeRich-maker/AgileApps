"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import clsx from "clsx";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface SprintProgressProps {
  sprint: {
    name: string;
    goal: string;
    progress: 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;
    daysLeft: number;
    totalTasks: number;
    completedTasks: number;
  };
}

export function SprintProgress({ sprint }: SprintProgressProps) {
  const { isAuthenticated, isAuthChecked, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isAuthChecked, router]);

  if (!isAuthChecked) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
        🔐 Checking authentication...
      </div>
    );
  }

  const status =
    sprint.progress >= 80
      ? { label: "On Track", color: "green", icon: CheckCircle }
      : { label: "At Risk", color: "yellow", icon: AlertTriangle };

  const StatusIcon = status.icon;

  return (
    <Card
      className="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 
             shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out"
    >
      <CardHeader className="border-b border-gray-100 dark:border-neutral-800 pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-white">
          <Activity className="h-5 w-5 text-cardColor-600" />
          Now Running
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 mt-2">
        {/* Sprint Info */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {sprint.name}
          </h3>
        </div>

        <div className="w-24 h-24 mx-auto">
          <CircularProgressbarWithChildren
            value={sprint.progress}
            strokeWidth={20}
            styles={buildStyles({
              pathColor:
                sprint.progress >= 70
                  ? "#16a34a"
                  : sprint.progress >= 50
                  ? "#f59e0b"
                  : "#dc2626",
              trailColor: "#f3f4f6",
            })}
          >
            <div className="text-sm font-semibold text-gray-800 dark:text-white">
              {sprint.progress}%
            </div>
          </CircularProgressbarWithChildren>
          <div className="mt-2 text-center text-sm font-medium">
            {sprint.progress < 50 && (
              <span className="text-red-500">😢 Keep pushing!</span>
            )}
            {sprint.progress >= 50 && sprint.progress < 70 && (
              <span className="text-yellow-500">🔥 You’re heating up!</span>
            )}
            {sprint.progress >= 70 && (
              <span className="text-green-600">💪 Strong progress!</span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-white">
            <Clock className="h-4 w-4 text-cardColor-600" />
            <span>
              {sprint.daysLeft} day{sprint.daysLeft !== 1 && "s"} left
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs font-semibold px-3 py-1 border-cardColor-600 text-cardColor-600 bg-cardColor-100"
            >
              {sprint.completedTasks}/{sprint.totalTasks} Tasks
            </Badge>
            <Badge
              className={clsx(
                "text-xs font-semibold px-3 py-1 flex items-center gap-1",
                status.color === "green"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
