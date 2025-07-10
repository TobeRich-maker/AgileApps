"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ThumbsUp, ThumbsDown, Lightbulb, Heart, Smile, Frown, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FeedbackItem {
  id: string
  content: string
  author: string
  authorId: string
  category: "went_well" | "went_wrong" | "suggestions"
  createdAt: string
  reactions: {
    thumbsUp: number
    heart: number
    smile: number
    frown: number
  }
  userReactions: string[]
}

interface Sprint {
  id: string
  name: string
  status: string
}

const mockSprints: Sprint[] = [
  { id: "1", name: "Sprint 23", status: "Completed" },
  { id: "2", name: "Sprint 22", status: "Completed" },
  { id: "3", name: "Sprint 21", status: "Completed" },
]

const mockFeedback: FeedbackItem[] = [
  {
    id: "1",
    content: "Great collaboration between frontend and backend teams",
    author: "John Doe",
    authorId: "user-1",
    category: "went_well",
    createdAt: "2024-01-20T10:00:00Z",
    reactions: { thumbsUp: 5, heart: 2, smile: 1, frown: 0 },
    userReactions: ["thumbsUp"],
  },
  {
    id: "2",
    content: "Daily standups were too long and unfocused",
    author: "Jane Smith",
    authorId: "user-2",
    category: "went_wrong",
    createdAt: "2024-01-20T11:00:00Z",
    reactions: { thumbsUp: 3, heart: 0, smile: 0, frown: 1 },
    userReactions: [],
  },
  {
    id: "3",
    content: "Implement pair programming sessions for complex features",
    author: "Mike Johnson",
    authorId: "user-3",
    category: "suggestions",
    createdAt: "2024-01-20T12:00:00Z",
    reactions: { thumbsUp: 4, heart: 1, smile: 2, frown: 0 },
    userReactions: ["heart"],
  },
]

export default function RetrospectivePage() {
  const [selectedSprint, setSelectedSprint] = useState("1")
  const [feedback, setFeedback] = useState<FeedbackItem[]>(mockFeedback)
  const [isAddingFeedback, setIsAddingFeedback] = useState(false)
  const [newFeedback, setNewFeedback] = useState({
    content: "",
    category: "went_well" as FeedbackItem["category"],
  })

  const categories = [
    {
      id: "went_well",
      title: "What Went Well",
      icon: ThumbsUp,
      color: "bg-green-100 border-green-200",
      iconColor: "text-green-600",
    },
    {
      id: "went_wrong",
      title: "What Didn't Go Well",
      icon: ThumbsDown,
      color: "bg-red-100 border-red-200",
      iconColor: "text-red-600",
    },
    {
      id: "suggestions",
      title: "Suggestions",
      icon: Lightbulb,
      color: "bg-yellow-100 border-yellow-200",
      iconColor: "text-yellow-600",
    },
  ]

  const reactionIcons = {
    thumbsUp: ThumbsUp,
    heart: Heart,
    smile: Smile,
    frown: Frown,
  }

  const handleAddFeedback = () => {
    if (!newFeedback.content.trim()) return

    const feedback: FeedbackItem = {
      id: Date.now().toString(),
      content: newFeedback.content,
      author: "Current User",
      authorId: "current-user",
      category: newFeedback.category,
      createdAt: new Date().toISOString(),
      reactions: { thumbsUp: 0, heart: 0, smile: 0, frown: 0 },
      userReactions: [],
    }

    setFeedback((prev) => [...prev, feedback])
    setNewFeedback({ content: "", category: "went_well" })
    setIsAddingFeedback(false)
  }

  const handleReaction = (feedbackId: string, reactionType: keyof FeedbackItem["reactions"]) => {
    setFeedback((prev) =>
      prev.map((item) => {
        if (item.id === feedbackId) {
          const hasReacted = item.userReactions.includes(reactionType)
          return {
            ...item,
            reactions: {
              ...item.reactions,
              [reactionType]: hasReacted ? item.reactions[reactionType] - 1 : item.reactions[reactionType] + 1,
            },
            userReactions: hasReacted
              ? item.userReactions.filter((r) => r !== reactionType)
              : [...item.userReactions.filter((r) => r !== reactionType), reactionType],
          }
        }
        return item
      }),
    )
  }

  const handleDeleteFeedback = (feedbackId: string) => {
    setFeedback((prev) => prev.filter((item) => item.id !== feedbackId))
  }

  const getFeedbackByCategory = (category: FeedbackItem["category"]) => {
    return feedback.filter((item) => item.category === category)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sprint Retrospective</h1>
            <p className="text-muted-foreground">Reflect on the sprint and gather team feedback.</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedSprint} onValueChange={setSelectedSprint}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockSprints.map((sprint) => (
                  <SelectItem key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isAddingFeedback} onOpenChange={setIsAddingFeedback}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feedback
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Feedback</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newFeedback.category}
                      onValueChange={(value: FeedbackItem["category"]) =>
                        setNewFeedback((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Feedback</Label>
                    <Textarea
                      id="content"
                      value={newFeedback.content}
                      onChange={(e) => setNewFeedback((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your thoughts..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingFeedback(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddFeedback} className="bg-green-600 hover:bg-green-700">
                      Add Feedback
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className={category.color}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className={`h-5 w-5 ${category.iconColor}`} />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getFeedbackByCategory(category.id as FeedbackItem["category"]).map((item) => (
                  <Card key={item.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{item.author.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{item.author}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleDeleteFeedback(item.id)} className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{item.content}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {Object.entries(reactionIcons).map(([type, Icon]) => (
                            <Button
                              key={type}
                              variant="ghost"
                              size="sm"
                              className={`h-6 px-2 ${
                                item.userReactions.includes(type) ? "bg-blue-100 text-blue-600" : ""
                              }`}
                              onClick={() => handleReaction(item.id, type as keyof FeedbackItem["reactions"])}
                            >
                              <Icon className="h-3 w-3 mr-1" />
                              {item.reactions[type as keyof FeedbackItem["reactions"]]}
                            </Button>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {getFeedbackByCategory(category.id as FeedbackItem["category"]).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <category.icon className={`h-8 w-8 mx-auto mb-2 ${category.iconColor} opacity-50`} />
                    <p className="text-sm">No feedback yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
