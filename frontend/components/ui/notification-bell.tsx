"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import type { Notification } from "@/lib/types/api";

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Task Deadline Approaching",
    message: "User Authentication Form is due in 2 hours",
    type: "task_deadline",
    read: false,
    userId: "user-1",
    createdAt: "2024-01-20T14:30:00Z",
    metadata: { taskId: "task-1" },
  },
  {
    id: "2",
    title: "Sprint Started",
    message: "Sprint 24 has been started by John Doe",
    type: "sprint_event",
    read: false,
    userId: "user-1",
    createdAt: "2024-01-20T09:00:00Z",
    metadata: { sprintId: "sprint-24" },
  },
  {
    id: "3",
    title: "New Task Assignment",
    message: "You have been assigned to Dashboard Layout task",
    type: "task_assignment",
    read: true,
    userId: "user-1",
    createdAt: "2024-01-19T16:45:00Z",
    metadata: { taskId: "task-2" },
  },
  {
    id: "4",
    title: "Sprint Completed",
    message: "Sprint 23 has been completed successfully",
    type: "sprint_event",
    read: true,
    userId: "user-1",
    createdAt: "2024-01-19T10:00:00Z",
    metadata: { sprintId: "sprint-23" },
  },
];

export function NotificationBell() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Calculate unread count
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "task_deadline":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "sprint_event":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case "task_assignment":
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // In real app, call API
      // await notificationsApi.markAsRead(notificationId)

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // In real app, call API
      // await notificationsApi.markAllAsRead()

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // In real app, call API
      // await notificationsApi.delete(notificationId)

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No notifications
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() =>
                                    handleMarkAsRead(notification.id)
                                  }
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  handleDeleteNotification(notification.id)
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
