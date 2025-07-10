"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Globe,
  Calendar,
  Users,
  Target,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  Activity,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock public project data
const mockPublicProject = {
  id: "project-1",
  name: "E-commerce Platform",
  description:
    "Building a modern, scalable e-commerce platform with React, Node.js, and PostgreSQL. This project aims to create a comprehensive online shopping experience with advanced features like real-time inventory management, personalized recommendations, and seamless payment processing.",
  status: "Active",
  difficulty: "Hard",
  progress: 68,
  startDate: "2024-01-01",
  estimatedEndDate: "2024-06-30",
  teamSize: 8,
  totalSprints: 12,
  completedSprints: 8,
  totalTasks: 156,
  completedTasks: 106,
  totalStoryPoints: 420,
  completedStoryPoints: 285,
  sprints: [
    {
      id: "sprint-1",
      name: "Sprint 1: Foundation",
      status: "Completed",
      startDate: "2024-01-01",
      endDate: "2024-01-14",
      progress: 100,
      storyPoints: 35,
      completedPoints: 35,
    },
    {
      id: "sprint-2",
      name: "Sprint 2: User Management",
      status: "Completed",
      startDate: "2024-01-15",
      endDate: "2024-01-28",
      progress: 100,
      storyPoints: 32,
      completedPoints: 32,
    },
    {
      id: "sprint-3",
      name: "Sprint 3: Product Catalog",
      status: "Completed",
      startDate: "2024-01-29",
      endDate: "2024-02-11",
      progress: 100,
      storyPoints: 38,
      completedPoints: 38,
    },
    {
      id: "sprint-4",
      name: "Sprint 4: Shopping Cart",
      status: "In Progress",
      startDate: "2024-02-12",
      endDate: "2024-02-25",
      progress: 75,
      storyPoints: 40,
      completedPoints: 30,
    },
    {
      id: "sprint-5",
      name: "Sprint 5: Payment Integration",
      status: "Planned",
      startDate: "2024-02-26",
      endDate: "2024-03-11",
      progress: 0,
      storyPoints: 45,
      completedPoints: 0,
    },
  ],
  milestones: [
    {
      id: "milestone-1",
      name: "MVP Release",
      description: "Basic e-commerce functionality with user management and product catalog",
      dueDate: "2024-03-15",
      status: "In Progress",
      progress: 85,
    },
    {
      id: "milestone-2",
      name: "Payment System",
      description: "Complete payment processing with multiple payment methods",
      dueDate: "2024-04-30",
      status: "Planned",
      progress: 0,
    },
    {
      id: "milestone-3",
      name: "Advanced Features",
      description: "Recommendations, analytics, and admin dashboard",
      dueDate: "2024-06-30",
      status: "Planned",
      progress: 0,
    },
  ],
  techStack: ["React", "Node.js", "PostgreSQL", "Redis", "AWS"],
}

export default function PublicProjectPage() {
  const searchParams = useSearchParams()
  const [project, setProject] = useState(mockPublicProject)
  const [isValidToken, setIsValidToken] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = searchParams.get("token")
    const view = searchParams.get("view")

    // Simulate token validation
    setTimeout(() => {
      if (view === "public" && token) {
        // In real app, validate token with API
        setIsValidToken(true)
      }
      setIsLoading(false)
    }, 1000)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Access Denied</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Invalid or missing access token. Please check your link and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Planned":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Hard":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "Extreme":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-navy-100 dark:bg-navy-800 rounded-lg">
              <Globe className="h-6 w-6 text-navy-600 dark:text-navy-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-navy-900 dark:text-navy-100">{project.name}</h1>
              <p className="text-slate-600 dark:text-slate-400">Public Project View</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            <Badge className={getDifficultyColor(project.difficulty)}>{project.difficulty}</Badge>
            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
              <Users className="h-4 w-4" />
              {project.teamSize} team members
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              {formatDate(project.startDate)} - {formatDate(project.estimatedEndDate)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{project.description}</p>

                <div className="mt-6">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Technology Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sprint Roadmap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-navy-600" />
                  Sprint Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.sprints.map((sprint, index) => (
                    <div key={sprint.id} className="relative">
                      {index < project.sprints.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-16 bg-slate-200 dark:bg-slate-700" />
                      )}

                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                            sprint.status === "Completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : sprint.status === "In Progress"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
                          )}
                        >
                          {sprint.status === "Completed" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : sprint.status === "In Progress" ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{sprint.name}</h4>
                            <Badge className={getStatusColor(sprint.status)}>{sprint.status}</Badge>
                          </div>

                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                          </div>

                          <div className="flex items-center gap-4 mb-2">
                            <div className="text-sm">
                              <span className="text-slate-600 dark:text-slate-400">Progress: </span>
                              <span className="font-medium">{sprint.progress}%</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-slate-600 dark:text-slate-400">Story Points: </span>
                              <span className="font-medium">
                                {sprint.completedPoints}/{sprint.storyPoints}
                              </span>
                            </div>
                          </div>

                          <Progress value={sprint.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-navy-600" />
                  Project Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.milestones.map((milestone) => (
                    <div key={milestone.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{milestone.name}</h4>
                        <Badge className={getStatusColor(milestone.status)}>{milestone.status}</Badge>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{milestone.description}</p>

                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Due: {formatDate(milestone.dueDate)}
                        </div>
                        <div className="text-sm font-medium">{milestone.progress}% complete</div>
                      </div>

                      <Progress value={milestone.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-navy-600" />
                  Project Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Overall Progress</span>
                  <span className="font-semibold text-navy-900 dark:text-navy-100">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-3" />

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Sprints</span>
                    <span className="font-medium">
                      {project.completedSprints}/{project.totalSprints}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Tasks</span>
                    <span className="font-medium">
                      {project.completedTasks}/{project.totalTasks}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Story Points</span>
                    <span className="font-medium">
                      {project.completedStoryPoints}/{project.totalStoryPoints}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Team Size</span>
                    <span className="font-medium">{project.teamSize} members</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Velocity</p>
                      <p className="text-2xl font-bold text-green-600">32.5</p>
                      <p className="text-xs text-slate-500">avg points/sprint</p>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Days Left</p>
                      <p className="text-2xl font-bold text-blue-600">127</p>
                      <p className="text-xs text-slate-500">until completion</p>
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Need More Information?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  This is a read-only view of the project. For detailed information or to join the project, please
                  contact the project team.
                </p>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Last updated: {formatDate(new Date().toISOString())}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
