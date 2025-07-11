"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Calendar, CheckCircle, Users } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalProjects: number;
    activeSprints: number;
    completedTasks: number;
    teamMembers: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      color: "text-cardColor-600",
      bgColor: "bg-cardColor-100",
    },
    {
      title: "Active Sprints",
      value: stats.activeSprints,
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Team Members",
      value: stats.teamMembers,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="rounded-2xl border border-transparent bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out dark:bg-[#1a1a1a] dark:border-neutral-800"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                {card.title}
              </CardTitle>
              <div className="text-3xl font-semibold text-gray-900 dark:text-white mt-1">
                {card.value}
              </div>
            </div>
            <div
              className={`p-3 rounded-xl ${card.bgColor} ${card.color} shadow-inner`}
            >
              <card.icon className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mt-2">
              Compared to last period {/* ← Optional info growth/insight */}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
