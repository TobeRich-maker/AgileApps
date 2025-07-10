"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, TrendingUp, Activity, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { activityHeatmapData, weeklyActivityData, monthlyProductivityData } from "@/lib/dummy/report-data"

interface ActivityHeatmapProps {
  userId?: string
  teamView?: boolean
}

export function ActivityHeatmap({ userId, teamView = false }: ActivityHeatmapProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [viewMode, setViewMode] = useState<"individual" | "team">(teamView ? "team" : "individual")

  // Generate heatmap data for the selected year
  const heatmapData = useMemo(() => {
    const startDate = new Date(selectedYear, 0, 1)
    const endDate = new Date(selectedYear, 11, 31)
    const data = []

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      const existingData = activityHeatmapData.find((item) => item.date === dateStr)

      data.push({
        date: dateStr,
        count: existingData?.count || Math.floor(Math.random() * 8),
        level: existingData?.level || Math.floor(Math.random() * 5),
        dayOfWeek: d.getDay(),
        week: Math.floor((d.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)),
      })
    }

    return data
  }, [selectedYear])

  // Group data by weeks
  const weeklyData = useMemo(() => {
    const weeks: { [key: number]: typeof heatmapData } = {}
    heatmapData.forEach((day) => {
      if (!weeks[day.week]) weeks[day.week] = []
      weeks[day.week].push(day)
    })
    return weeks
  }, [heatmapData])

  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-slate-100 dark:bg-slate-800"
      case 1:
        return "bg-green-200 dark:bg-green-900"
      case 2:
        return "bg-green-300 dark:bg-green-700"
      case 3:
        return "bg-green-400 dark:bg-green-600"
      case 4:
        return "bg-green-500 dark:bg-green-500"
      default:
        return "bg-slate-100 dark:bg-slate-800"
    }
  }

  const getTooltipText = (day: (typeof heatmapData)[0]) => {
    const date = new Date(day.date)
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    if (day.count === 0) {
      return `${dateStr}: No activity`
    } else if (day.count === 1) {
      return `${dateStr}: 1 task completed`
    } else {
      return `${dateStr}: ${day.count} tasks completed`
    }
  }

  // Calculate stats
  const totalTasks = heatmapData.reduce((sum, day) => sum + day.count, 0)
  const activeDays = heatmapData.filter((day) => day.count > 0).length
  const averageDaily = totalTasks / Math.max(activeDays, 1)
  const longestStreak = useMemo(() => {
    let maxStreak = 0
    let currentStreak = 0

    heatmapData.forEach((day) => {
      if (day.count > 0) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    })

    return maxStreak
  }, [heatmapData])

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-900 dark:text-navy-100">Activity Heatmap</h2>
          <p className="text-slate-600 dark:text-slate-400">Track daily productivity and task completion patterns</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear.toString()} onValueChange={(year) => setSelectedYear(Number.parseInt(year))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2023, 2022].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {teamView && (
            <Select value={viewMode} onValueChange={(mode: "individual" | "team") => setViewMode(mode)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</p>
                <p className="text-2xl font-bold text-navy-900 dark:text-navy-100">{totalTasks}</p>
              </div>
              <div className="p-2 bg-navy-100 dark:bg-navy-800 rounded-lg">
                <Target className="h-5 w-5 text-navy-600 dark:text-navy-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Days</p>
                <p className="text-2xl font-bold text-green-600">{activeDays}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Daily Average</p>
                <p className="text-2xl font-bold text-blue-600">{averageDaily.toFixed(1)}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Longest Streak</p>
                <p className="text-2xl font-bold text-purple-600">{longestStreak}</p>
                <p className="text-xs text-slate-500">days</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-navy-600" />
            {selectedYear} Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Month labels */}
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 px-8">
              {monthNames.map((month, index) => (
                <span
                  key={month}
                  className={cn(
                    "flex-1 text-center",
                    index === 0 && "text-left",
                    index === monthNames.length - 1 && "text-right",
                  )}
                >
                  {month}
                </span>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-400 pr-2">
                {dayNames.map((day, index) => (
                  <div key={day} className="h-3 flex items-center">
                    {index % 2 === 1 && <span>{day}</span>}
                  </div>
                ))}
              </div>

              {/* Heatmap cells */}
              <div className="flex gap-1 overflow-x-auto">
                {Object.entries(weeklyData).map(([week, days]) => (
                  <div key={week} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const day = days.find((d) => d.dayOfWeek === dayIndex)
                      return (
                        <div
                          key={dayIndex}
                          className={cn(
                            "w-3 h-3 rounded-sm border border-slate-200 dark:border-slate-700 cursor-pointer transition-all hover:scale-110",
                            day ? getIntensityColor(day.level) : "bg-slate-100 dark:bg-slate-800",
                          )}
                          title={day ? getTooltipText(day) : ""}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div key={level} className={cn("w-3 h-3 rounded-sm", getIntensityColor(level))} />
                  ))}
                </div>
                <span>More</span>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                {totalTasks} tasks completed in {selectedYear}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyActivityData.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{day.day}</span>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 w-32">
                      <div
                        className="bg-navy-600 h-2 rounded-full transition-all"
                        style={{ width: `${(day.tasks / 12) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{day.tasks} tasks</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyProductivityData.slice(0, 6).map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{month.month}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {month.tasksCompleted} tasks
                      </Badge>
                      <Badge variant={month.efficiency >= 100 ? "default" : "secondary"} className="text-xs">
                        {month.efficiency}% efficiency
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{month.hoursWorked}h</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
