"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, CalendarIcon, Activity, CheckSquare, FolderKanban, Users, GitBranch, Clock } from "lucide-react"
import { format } from "date-fns"

interface AuditLogEntry {
  id: string
  action: string
  actor: string
  actorId: string
  target: string
  targetType: "task" | "project" | "sprint" | "user" | "role"
  targetId: string
  timestamp: string
  details: string
  metadata?: {
    oldValue?: string
    newValue?: string
    projectName?: string
    sprintName?: string
  }
}

const mockAuditLog: AuditLogEntry[] = [
  {
    id: "1",
    action: "task_status_changed",
    actor: "John Doe",
    actorId: "user-1",
    target: "User Authentication Form",
    targetType: "task",
    targetId: "task-1",
    timestamp: "2024-01-20T14:30:00Z",
    details: "Changed task status from 'To Do' to 'In Progress'",
    metadata: {
      oldValue: "To Do",
      newValue: "In Progress",
      projectName: "E-commerce Platform",
    },
  },
  {
    id: "2",
    action: "sprint_started",
    actor: "Jane Smith",
    actorId: "user-2",
    target: "Sprint 24",
    targetType: "sprint",
    targetId: "sprint-24",
    timestamp: "2024-01-20T09:00:00Z",
    details: "Started sprint with 15 tasks and 42 story points",
    metadata: {
      projectName: "E-commerce Platform",
    },
  },
  {
    id: "3",
    action: "user_role_changed",
    actor: "Admin User",
    actorId: "admin-1",
    target: "Mike Johnson",
    targetType: "user",
    targetId: "user-3",
    timestamp: "2024-01-19T16:45:00Z",
    details: "Changed user role from 'Developer' to 'Senior Developer'",
    metadata: {
      oldValue: "Developer",
      newValue: "Senior Developer",
    },
  },
  {
    id: "4",
    action: "task_assigned",
    actor: "Sarah Wilson",
    actorId: "user-4",
    target: "Dashboard Layout",
    targetType: "task",
    targetId: "task-2",
    timestamp: "2024-01-19T11:20:00Z",
    details: "Assigned task to Tom Brown",
    metadata: {
      newValue: "Tom Brown",
      projectName: "Mobile Banking App",
    },
  },
  {
    id: "5",
    action: "project_created",
    actor: "Product Owner",
    actorId: "user-5",
    target: "Analytics Dashboard",
    targetType: "project",
    targetId: "project-3",
    timestamp: "2024-01-18T10:00:00Z",
    details: "Created new project with 3 team members",
    metadata: {},
  },
]

export default function AuditLogPage() {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(mockAuditLog)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterActor, setFilterActor] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  const actionTypes = [
    { value: "all", label: "All Actions" },
    { value: "task_status_changed", label: "Task Status Changed" },
    { value: "task_assigned", label: "Task Assigned" },
    { value: "sprint_started", label: "Sprint Started" },
    { value: "sprint_completed", label: "Sprint Completed" },
    { value: "project_created", label: "Project Created" },
    { value: "user_role_changed", label: "User Role Changed" },
  ]

  const uniqueActors = Array.from(new Set(auditLog.map((entry) => entry.actor)))

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      entry.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || entry.action === filterType
    const matchesActor = filterActor === "all" || entry.actor === filterActor

    let matchesDate = true
    if (dateRange.from || dateRange.to) {
      const entryDate = new Date(entry.timestamp)
      if (dateRange.from && entryDate < dateRange.from) matchesDate = false
      if (dateRange.to && entryDate > dateRange.to) matchesDate = false
    }

    return matchesSearch && matchesType && matchesActor && matchesDate
  })

  const getActionIcon = (action: string) => {
    switch (action) {
      case "task_status_changed":
      case "task_assigned":
        return <CheckSquare className="h-4 w-4" />
      case "sprint_started":
      case "sprint_completed":
        return <GitBranch className="h-4 w-4" />
      case "project_created":
        return <FolderKanban className="h-4 w-4" />
      case "user_role_changed":
        return <Users className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "task_status_changed":
        return "text-blue-600"
      case "task_assigned":
        return "text-green-600"
      case "sprint_started":
        return "text-purple-600"
      case "sprint_completed":
        return "text-indigo-600"
      case "project_created":
        return "text-emerald-600"
      case "user_role_changed":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-muted-foreground">Track all important project activities and changes.</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterActor} onValueChange={setFilterActor}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueActors.map((actor) => (
                    <SelectItem key={actor} value={actor}>
                      {actor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-48 bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Activity Timeline ({filteredLog.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLog.map((entry, index) => (
                <div key={entry.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`flex-shrink-0 p-2 rounded-full bg-gray-100 ${getActionColor(entry.action)}`}>
                    {getActionIcon(entry.action)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{entry.actor.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{entry.actor}</span>
                      <Badge variant="outline" className="text-xs">
                        {entry.targetType}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">{entry.target}</span> - {entry.details}
                    </p>

                    {entry.metadata?.projectName && (
                      <p className="text-xs text-muted-foreground mb-1">Project: {entry.metadata.projectName}</p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(entry.timestamp)}</span>
                      <span>•</span>
                      <span>{new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLog.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No activities found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
