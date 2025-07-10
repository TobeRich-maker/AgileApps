"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, Calendar, CheckCircle, Users } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalProjects: number
    activeSprints: number
    completedTasks: number
    teamMembers: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Sprints",
      value: stats.activeSprints,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Team Members",
      value: stats.teamMembers,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
