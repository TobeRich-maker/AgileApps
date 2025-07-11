"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ListChecks } from "lucide-react";
import clsx from "clsx";

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "task" | "sprint" | "project";
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "task":
        return "bg-blue-50 text-blue-700";
      case "sprint":
        return "bg-green-50 text-green-700";
      case "project":
        return "bg-purple-50 text-purple-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <Card className="rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-white tracking-tight">
          <ListChecks className="h-5 w-5 text-cardColor-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 group px-3 py-2 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
          >
            <Avatar className="h-9 w-9 ring-1 ring-cardColor-100 group-hover:scale-105 group-hover:opacity-90 transition-transform duration-200">
              <AvatarFallback className="text-xs font-semibold">
                {activity.user.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 dark:text-white leading-snug">
                <span className="font-semibold">{activity.user}</span>{" "}
                {activity.action}{" "}
                <span className="font-semibold text-cardColor-600">
                  {activity.target}
                </span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className={clsx(
                    "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                    getTypeColor(activity.type)
                  )}
                >
                  {activity.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
