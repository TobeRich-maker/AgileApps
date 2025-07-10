"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, FolderKanban, CheckSquare, Calendar, ArrowRight, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  type: "task" | "project" | "sprint" | "user"
  url: string
  metadata?: {
    status?: string
    priority?: string
    assignee?: string
    dueDate?: string
  }
}

// Mock search results
const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "User Authentication Form",
    subtitle: "E-commerce Platform",
    type: "task",
    url: "/tasks/1",
    metadata: { status: "In Progress", priority: "High", assignee: "John Doe" },
  },
  {
    id: "2",
    title: "E-commerce Platform",
    subtitle: "Building a modern e-commerce platform",
    type: "project",
    url: "/projects/1",
    metadata: { status: "Active" },
  },
  {
    id: "3",
    title: "Sprint 23",
    subtitle: "Implement user authentication and dashboard",
    type: "sprint",
    url: "/sprints/1",
    metadata: { status: "Active", dueDate: "2024-01-29" },
  },
  {
    id: "4",
    title: "John Doe",
    subtitle: "Senior Developer",
    type: "user",
    url: "/users/1",
    metadata: {},
  },
  {
    id: "5",
    title: "Dashboard Layout",
    subtitle: "Mobile Banking App",
    type: "task",
    url: "/tasks/2",
    metadata: { status: "To Do", priority: "Medium", assignee: "Jane Smith" },
  },
]

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Search function
  const search = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const filtered = mockSearchResults.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setResults(filtered)
    setSelectedIndex(0)
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => search(query), 150)
    return () => clearTimeout(timeoutId)
  }, [query, search])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % results.length)
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
          break
        case "Enter":
          e.preventDefault()
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex])
          }
          break
        case "Escape":
          onOpenChange(false)
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, results, selectedIndex, onOpenChange])

  const handleSelect = (result: SearchResult) => {
    onOpenChange(false)
    setQuery("")
    // Navigate to result URL
    window.location.href = result.url
  }

  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "task":
        return <CheckSquare className="h-4 w-4" />
      case "project":
        return <FolderKanban className="h-4 w-4" />
      case "sprint":
        return <Calendar className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: SearchResult["type"]) => {
    switch (type) {
      case "task":
        return "text-blue-600"
      case "project":
        return "text-green-600"
      case "sprint":
        return "text-purple-600"
      case "user":
        return "text-orange-600"
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Active":
      case "In Progress":
        return "bg-green-100 text-green-800"
      case "To Do":
        return "bg-gray-100 text-gray-800"
      case "Done":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, projects, sprints, users..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <div className="ml-2 flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {results.length > 0 && (
          <ScrollArea className="max-h-[400px]">
            <div className="p-2">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer transition-colors",
                    index === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
                  )}
                  onClick={() => handleSelect(result)}
                >
                  <div className={cn("flex-shrink-0", getTypeColor(result.type))}>{getTypeIcon(result.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{result.title}</div>
                    {result.subtitle && <div className="text-xs text-muted-foreground truncate">{result.subtitle}</div>}
                  </div>

                  <div className="flex items-center gap-2">
                    {result.metadata?.status && (
                      <Badge variant="secondary" className={cn("text-xs", getStatusColor(result.metadata.status))}>
                        {result.metadata.status}
                      </Badge>
                    )}
                    {result.metadata?.priority && (
                      <Badge variant="outline" className="text-xs">
                        {result.metadata.priority}
                      </Badge>
                    )}
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {query && results.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">No results found for "{query}"</div>
        )}

        {!query && (
          <div className="p-6">
            <div className="text-sm text-muted-foreground mb-4">Recent searches</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckSquare className="h-4 w-4" />
                <span>User Authentication Form</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FolderKanban className="h-4 w-4" />
                <span>E-commerce Platform</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Hook to manage command palette
export function useCommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return { open, setOpen }
}
