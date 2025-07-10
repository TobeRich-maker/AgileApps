"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Reply, AtSign, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Comment {
  id: string
  content: string
  author: string
  authorId: string
  createdAt: string
  updatedAt?: string
  mentions: string[]
  replies?: Comment[]
  isEditing?: boolean
}

interface TaskCommentsProps {
  taskId: string
}

const mockComments: Comment[] = [
  {
    id: "1",
    content: "I've started working on the authentication form. @jane-smith could you review the design mockups?",
    author: "John Doe",
    authorId: "user-1",
    createdAt: "2024-01-20T10:00:00Z",
    mentions: ["jane-smith"],
    replies: [
      {
        id: "1-1",
        content: "The mockups look great. Just one suggestion - can we add a forgot password link?",
        author: "Jane Smith",
        authorId: "user-2",
        createdAt: "2024-01-20T11:00:00Z",
        mentions: [],
      },
    ],
  },
  {
    id: "2",
    content: "The API integration is complete. Ready for testing @mike-johnson",
    author: "Sarah Wilson",
    authorId: "user-3",
    createdAt: "2024-01-20T14:30:00Z",
    mentions: ["mike-johnson"],
  },
]

const teamMembers = [
  { id: "user-1", name: "John Doe", username: "john-doe" },
  { id: "user-2", name: "Jane Smith", username: "jane-smith" },
  { id: "user-3", name: "Sarah Wilson", username: "sarah-wilson" },
  { id: "user-4", name: "Mike Johnson", username: "mike-johnson" },
]

export function TaskComments({ taskId }: TaskCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const mentions = extractMentions(newComment)
    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: "Current User",
      authorId: "current-user",
      createdAt: new Date().toISOString(),
      mentions,
    }

    setComments((prev) => [...prev, comment])
    setNewComment("")
  }

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return

    const mentions = extractMentions(replyContent)
    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      content: replyContent,
      author: "Current User",
      authorId: "current-user",
      createdAt: new Date().toISOString(),
      mentions,
    }

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          }
        }
        return comment
      }),
    )

    setReplyContent("")
    setReplyingTo(null)
  }

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@([a-zA-Z0-9-_]+)/g
    const matches = text.match(mentionRegex)
    return matches ? matches.map((match) => match.substring(1)) : []
  }

  const handleMentionSelect = (username: string) => {
    const textarea = document.activeElement as HTMLTextAreaElement
    if (textarea) {
      const cursorPos = textarea.selectionStart
      const textBefore = textarea.value.substring(0, cursorPos)
      const textAfter = textarea.value.substring(cursorPos)
      const lastAtIndex = textBefore.lastIndexOf("@")

      if (lastAtIndex !== -1) {
        const newText = textBefore.substring(0, lastAtIndex) + `@${username} ` + textAfter
        if (textarea === document.querySelector("[data-comment-input]")) {
          setNewComment(newText)
        } else {
          setReplyContent(newText)
        }
      }
    }
    setShowMentions(false)
    setMentionQuery("")
  }

  const handleTextChange = (value: string, isReply = false) => {
    if (isReply) {
      setReplyContent(value)
    } else {
      setNewComment(value)
    }

    // Check for mentions
    const lastAtIndex = value.lastIndexOf("@")
    if (lastAtIndex !== -1) {
      const query = value.substring(lastAtIndex + 1)
      if (query.length > 0 && !query.includes(" ")) {
        setMentionQuery(query)
        setShowMentions(true)
      } else {
        setShowMentions(false)
      }
    } else {
      setShowMentions(false)
    }
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.username.toLowerCase().includes(mentionQuery.toLowerCase()) ||
      member.name.toLowerCase().includes(mentionQuery.toLowerCase()),
  )

  const formatContent = (content: string) => {
    return content.replace(/@([a-zA-Z0-9-_]+)/g, (match, username) => {
      const member = teamMembers.find((m) => m.username === username)
      return member ? `<span class="bg-blue-100 text-blue-800 px-1 rounded">@${member.name}</span>` : match
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-green-600" />
          Comments ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new comment */}
        <div className="space-y-2 relative">
          <Textarea
            data-comment-input
            value={newComment}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Add a comment... Use @username to mention team members"
            rows={3}
          />

          {showMentions && (
            <Card className="absolute top-full left-0 right-0 z-10 mt-1">
              <CardContent className="p-2">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
                    onClick={() => handleMentionSelect(member.username)}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">@{member.username}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AtSign className="h-3 w-3" />
              <span>Use @ to mention team members</span>
            </div>
            <Button onClick={handleAddComment} size="sm" className="bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4 mr-2" />
              Comment
            </Button>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</span>
                    {comment.mentions.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {comment.mentions.length} mention{comment.mentions.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  <div
                    className="text-sm text-gray-700 mb-2"
                    dangerouslySetInnerHTML={{ __html: formatContent(comment.content) }}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(comment.id)}
                      className="h-6 px-2 text-xs"
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 space-y-3 border-l-2 border-gray-100 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{reply.author.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{reply.author}</span>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(reply.createdAt)}</span>
                        </div>
                        <div
                          className="text-sm text-gray-700"
                          dangerouslySetInnerHTML={{ __html: formatContent(reply.content) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply input */}
              {replyingTo === comment.id && (
                <div className="ml-11 space-y-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => handleTextChange(e.target.value, true)}
                    placeholder="Write a reply..."
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddReply(comment.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No comments yet. Start the conversation!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
