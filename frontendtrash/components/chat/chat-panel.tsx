"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Users,
  Hash,
  X,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  timestamp: string;
  type: "message" | "system" | "mention";
  threadId?: string;
  reactions?: { emoji: string; users: string[]; count: number }[];
  attachments?: { name: string; url: string; type: string }[];
}

interface ChatRoom {
  id: string;
  name: string;
  type: "project" | "task" | "general";
  participants: number;
  unreadCount: number;
  lastMessage?: string;
  lastActivity: string;
}

// Mock data
const mockRooms: ChatRoom[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    type: "project",
    participants: 8,
    unreadCount: 3,
    lastMessage: "Updated the payment integration",
    lastActivity: "2 min ago",
  },
  {
    id: "2",
    name: "User Authentication Task",
    type: "task",
    participants: 3,
    unreadCount: 0,
    lastMessage: "Form validation is complete",
    lastActivity: "1 hour ago",
  },
  {
    id: "3",
    name: "General Discussion",
    type: "general",
    participants: 12,
    unreadCount: 1,
    lastMessage: "Team lunch tomorrow?",
    lastActivity: "30 min ago",
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    content:
      "Hey team! I've completed the user authentication forms. Ready for review.",
    author: {
      id: "1",
      name: "John Doe",
      role: "Frontend Developer",
    },
    timestamp: "2024-01-25T10:30:00Z",
    type: "message",
  },
  {
    id: "2",
    content: "Great work @john! I'll review it this afternoon.",
    author: {
      id: "2",
      name: "Jane Smith",
      role: "Tech Lead",
    },
    timestamp: "2024-01-25T10:35:00Z",
    type: "mention",
    reactions: [{ emoji: "👍", users: ["3", "4"], count: 2 }],
  },
  {
    id: "3",
    content: "John Doe has updated the task status to 'Ready for Review'",
    author: {
      id: "system",
      name: "System",
      role: "System",
    },
    timestamp: "2024-01-25T10:36:00Z",
    type: "system",
  },
  {
    id: "4",
    content:
      "I've also added some unit tests for the validation logic. The coverage is now at 95%.",
    author: {
      id: "1",
      name: "John Doe",
      role: "Frontend Developer",
    },
    timestamp: "2024-01-25T11:00:00Z",
    type: "message",
    attachments: [{ name: "test-coverage-report.pdf", url: "#", type: "pdf" }],
  },
];

interface ChatPanelProps {
  projectId?: string;
  taskId?: string;
  className?: string;
}

export function ChatPanel({ projectId, taskId, className }: ChatPanelProps) {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(mockRooms[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      author: {
        id: "current-user",
        name: "You",
        role: "Developer",
      },
      timestamp: new Date().toISOString(),
      type: "message",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  const getRoomIcon = (type: ChatRoom["type"]) => {
    switch (type) {
      case "project":
        return <Users className="h-4 w-4" />;
      case "task":
        return <MessageSquare className="h-4 w-4" />;
      case "general":
        return <Hash className="h-4 w-4" />;
    }
  };

  const getMessageTypeStyles = (type: ChatMessage["type"]) => {
    switch (type) {
      case "system":
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-center text-sm py-2";
      case "mention":
        return "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "";
    }
  };

  return (
    <div className={cn("flex h-full", className)}>
      {/* Room List */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Chat Rooms
            </h3>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {mockRooms.map((room) => (
              <Button
                key={room.id}
                variant={selectedRoom.id === room.id ? "secondary" : "ghost"}
                className="w-full justify-start p-3 h-auto"
                onClick={() => setSelectedRoom(room)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-shrink-0">{getRoomIcon(room.type)}</div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate">{room.name}</span>
                      {room.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {room.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="truncate">{room.lastMessage}</span>
                      <span className="flex-shrink-0 ml-2">
                        {room.lastActivity}
                      </span>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getRoomIcon(selectedRoom.type)}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedRoom.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedRoom.participants} participants
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View participants</DropdownMenuItem>
                <DropdownMenuItem>Room settings</DropdownMenuItem>
                <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Leave room
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "rounded-lg p-3",
                  getMessageTypeStyles(message.type)
                )}
              >
                {message.type === "system" ? (
                  <p>{message.content}</p>
                ) : (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {message.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                          {message.author.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {message.author.role}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {message.content}
                      </p>

                      {/* Attachments */}
                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded border"
                              >
                                <Paperclip className="h-4 w-4 text-slate-500" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                  {attachment.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs bg-transparent"
                            >
                              {reaction.emoji} {reaction.count}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <span className="text-sm">Someone is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${selectedRoom.name}...`}
                className="resize-none"
              />
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-navy-600 hover:bg-navy-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact chat widget for task/project pages
export function ChatWidget({
  projectId,
  taskId,
}: {
  projectId?: string;
  taskId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-navy-600 hover:bg-navy-700 shadow-lg z-40"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Chat Panel Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <div
            className="bg-black/20 absolute inset-0"
            onClick={() => setIsOpen(false)}
          />
          <Card className="w-[800px] h-[600px] relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-navy-600" />
                  Team Chat
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-80px)]">
              <ChatPanel projectId={projectId} taskId={taskId} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
