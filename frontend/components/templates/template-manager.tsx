"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileIcon as FileTemplate,
  Plus,
  Search,
  Filter,
  Copy,
  Edit,
  Trash2,
  Star,
  StarOff,
  FolderOpen,
  Calendar,
  CheckSquare,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Template {
  id: string
  name: string
  description: string
  type: "project" | "sprint" | "task"
  category: string
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
  usageCount: number
  isStarred: boolean
  tags: string[]
  content: {
    // Project template
    projectName?: string
    projectDescription?: string
    difficulty?: string
    estimatedDuration?: string
    teamSize?: number

    // Sprint template
    sprintDuration?: number
    sprintGoals?: string[]
    ceremonies?: string[]

    // Task template
    taskTitle?: string
    taskDescription?: string
    acceptanceCriteria?: string[]
    estimatedHours?: number
    priority?: string
  }
}

// Mock templates
const mockTemplates: Template[] = [
  {
    id: "1",
    name: "E-commerce Project Setup",
    description: "Complete template for setting up an e-commerce project with all necessary components",
    type: "project",
    category: "Web Development",
    author: { name: "John Doe" },
    createdAt: "2024-01-15",
    usageCount: 24,
    isStarred: true,
    tags: ["react", "nodejs", "ecommerce", "fullstack"],
    content: {
      projectName: "E-commerce Platform",
      projectDescription:
        "Build a modern, scalable e-commerce platform with user management, product catalog, shopping cart, and payment processing.",
      difficulty: "Hard",
      estimatedDuration: "6 months",
      teamSize: 8,
    },
  },
  {
    id: "2",
    name: "2-Week Sprint Template",
    description: "Standard 2-week sprint template with ceremonies and goals",
    type: "sprint",
    category: "Agile",
    author: { name: "Jane Smith" },
    createdAt: "2024-01-10",
    usageCount: 45,
    isStarred: false,
    tags: ["agile", "scrum", "sprint"],
    content: {
      sprintDuration: 14,
      sprintGoals: ["Complete user authentication module", "Implement basic product catalog", "Set up CI/CD pipeline"],
      ceremonies: ["Sprint Planning", "Daily Standups", "Sprint Review", "Retrospective"],
    },
  },
  {
    id: "3",
    name: "User Story Template",
    description: "Standard user story template with acceptance criteria",
    type: "task",
    category: "Requirements",
    author: { name: "Mike Johnson" },
    createdAt: "2024-01-08",
    usageCount: 67,
    isStarred: true,
    tags: ["user-story", "requirements", "agile"],
    content: {
      taskTitle: "As a [user type], I want [functionality] so that [benefit]",
      taskDescription: "Detailed description of the user story including context and background information.",
      acceptanceCriteria: [
        "Given [context], when [action], then [outcome]",
        "The feature should be accessible on mobile devices",
        "All form validations should work correctly",
      ],
      estimatedHours: 8,
      priority: "Medium",
    },
  },
  {
    id: "4",
    name: "Bug Fix Template",
    description: "Template for bug fix tasks with debugging steps",
    type: "task",
    category: "Maintenance",
    author: { name: "Sarah Wilson" },
    createdAt: "2024-01-05",
    usageCount: 32,
    isStarred: false,
    tags: ["bug", "debugging", "maintenance"],
    content: {
      taskTitle: "Fix: [Brief description of the bug]",
      taskDescription:
        "Steps to reproduce:\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\nExpected behavior:\n[Description]\n\nActual behavior:\n[Description]",
      acceptanceCriteria: [
        "Bug is fixed and no longer reproducible",
        "No regression in existing functionality",
        "Unit tests added to prevent future occurrences",
      ],
      estimatedHours: 4,
      priority: "High",
    },
  },
]

export function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "project" | "sprint" | "task">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: "",
    description: "",
    type: "task",
    category: "",
    tags: [],
    content: {},
  })

  const useTemplate = (template: Template) => {
    // Increment usage count
    setTemplates((prev) => prev.map((t) => (t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t)))

    // Here you would typically navigate to create form with template data
    console.log("Using template:", template)
  }

  const toggleStar = (templateId: string) => {
    setTemplates((prev) =>
      prev.map((template) => (template.id === templateId ? { ...template, isStarred: !template.isStarred } : template)),
    )
  }

  const duplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      usageCount: 0,
      isStarred: false,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setTemplates((prev) => [newTemplate, ...prev])
  }

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId))
  }

  const getTypeIcon = (type: Template["type"]) => {
    switch (type) {
      case "project":
        return <FolderOpen className="h-4 w-4" />
      case "sprint":
        return <Calendar className="h-4 w-4" />
      case "task":
        return <CheckSquare className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: Template["type"]) => {
    switch (type) {
      case "project":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "sprint":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "task":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    }
  }

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = filterType === "all" || template.type === filterType
    const matchesCategory = filterCategory === "all" || template.category === filterCategory

    return matchesSearch && matchesType && matchesCategory
  })

  // Get unique categories
  const categories = Array.from(new Set(templates.map((t) => t.category)))

  const handleUseTemplate = (template: Template) => {
    useTemplate(template)
  }

  const handleDuplicateTemplate = (template: Template) => {
    duplicateTemplate(template)
  }

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-navy-100">Templates</h1>
          <p className="text-slate-600 dark:text-slate-400">Reusable templates for projects, sprints, and tasks</p>
        </div>
        <Button className="bg-navy-600 hover:bg-navy-700" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Create Template Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>Create a reusable template for projects, sprints, or tasks.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Template Name</Label>
                <Input
                  value={newTemplate.name || ""}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={newTemplate.type || "task"}
                  onValueChange={(type: Template["type"]) => setNewTemplate({ ...newTemplate, type })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="sprint">Sprint</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={newTemplate.description || ""}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Describe what this template is for"
                rows={3}
              />
            </div>

            <div>
              <Label>Category</Label>
              <Input
                value={newTemplate.category || ""}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                placeholder="e.g., Web Development, Mobile, Testing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(value: typeof filterType) => setFilterType(value)}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                  <SelectItem value="sprint">Sprints</SelectItem>
                  <SelectItem value="task">Tasks</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(template.type)}
                  <Badge className={getTypeColor(template.type)}>{template.type}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => toggleStar(template.id)} className="h-8 w-8">
                    {template.isStarred ? (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    ) : (
                      <StarOff className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileTemplate className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUseTemplate(template)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Use Template
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedTemplate(template)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteTemplate(template.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{template.description}</p>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Category</span>
                  <Badge variant="outline">{template.category}</Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Used</span>
                  <span className="font-medium">{template.usageCount} times</span>
                </div>

                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{template.author.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{template.author.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <Button onClick={() => handleUseTemplate(template)} className="w-full bg-navy-600 hover:bg-navy-700">
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <FileTemplate className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No templates found</h3>
          <p className="text-slate-600 dark:text-slate-400">
            {searchQuery ? "Try adjusting your search or filters" : "Create your first template to get started"}
          </p>
        </div>
      )}
    </div>
  )
}
