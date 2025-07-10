"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";

interface SprintProgressProps {
  sprint: {
    name: string;
    goal: string;
    progress: number;
    daysLeft: number;
    totalTasks: number;
    completedTasks: number;
  };
}

export function SprintProgress({ sprint }: SprintProgressProps) {
  const { isAuthenticated, isAuthChecked, checkAuth } = useAuthStore();
  const router = useRouter();

  // Cek autentikasi saat komponen mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect ke login jika tidak terautentikasi
  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isAuthChecked, router]);

  // Tunggu pengecekan selesai
  if (!isAuthChecked) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        🔐 Checking authentication...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-600" />
          Current Sprint
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{sprint.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{sprint.goal}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{sprint.progress}%</span>
          </div>
          <Progress value={sprint.progress} className="h-2" />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{sprint.daysLeft} days left</span>
          </div>
          <Badge variant="secondary">
            {sprint.completedTasks}/{sprint.totalTasks} tasks
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
