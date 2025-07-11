"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Users,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { withAuthProtection } from "@/lib/hoc/withAuthProtection";

interface CalendarEvent {
  id: string;
  title: string;
  type: "task" | "sprint" | "meeting" | "deadline";
  date: string;
  time?: string;
  endTime?: string;
  priority?: "Low" | "Medium" | "High" | "Critical";
  status?: "To Do" | "In Progress" | "Done";
  assignee?: {
    name: string;
    avatar?: string;
  };
  project?: string;
  description?: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "User Authentication Task",
    type: "task",
    date: "2024-01-25",
    time: "09:00",
    endTime: "11:00",
    priority: "High",
    status: "In Progress",
    assignee: { name: "John Doe" },
    project: "E-commerce Platform",
    description: "Complete user login and registration forms",
  },
  {
    id: "2",
    title: "Sprint 23 Planning",
    type: "meeting",
    date: "2024-01-26",
    time: "10:00",
    endTime: "12:00",
    assignee: { name: "Team" },
    project: "E-commerce Platform",
    description: "Plan tasks and goals for Sprint 23",
  },
  {
    id: "3",
    title: "Sprint 22 Ends",
    type: "sprint",
    date: "2024-01-28",
    status: "Done",
    project: "E-commerce Platform",
    description: "Sprint 22 completion and review",
  },
  {
    id: "4",
    title: "API Documentation",
    type: "deadline",
    date: "2024-01-30",
    priority: "Medium",
    assignee: { name: "Jane Smith" },
    project: "E-commerce Platform",
    description: "Complete API documentation for v1.0",
  },
  {
    id: "5",
    title: "Database Migration",
    type: "task",
    date: "2024-02-01",
    time: "14:00",
    endTime: "16:00",
    priority: "Critical",
    status: "To Do",
    assignee: { name: "Mike Johnson" },
    project: "E-commerce Platform",
    description: "Migrate database to new schema",
  },
];

function formatTime(time?: string) {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

function getPriorityColor(priority?: string) {
  return (
    {
      Critical: "border-l-red-500",
      High: "border-l-orange-500",
      Medium: "border-l-yellow-500",
      Low: "border-l-green-500",
    }[priority ?? ""] || "border-l-slate-300"
  );
}

function getEventTypeColor(type: CalendarEvent["type"]) {
  return (
    {
      task: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      sprint:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      meeting:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      deadline: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }[type] || "bg-gray-100 text-gray-800"
  );
}

export default withAuthProtection(function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [filterType, setFilterType] = useState<
    "all" | "task" | "sprint" | "meeting" | "deadline"
  >("all");

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return events.filter((event) => {
      const eventDate = event.date;
      const matchesDate = eventDate === dateString;
      const matchesFilter = filterType === "all" || event.type === filterType;
      return matchesDate && matchesFilter;
    });
  };

  const getTodaysEvents = () => {
    const today = new Date().toISOString().split("T")[0];
    return events
      .filter((event) => event.date === today)
      .sort((a, b) => {
        if (!a.time || !b.time) return 0;
        return a.time.localeCompare(b.time);
      });
  };

  const getUpcomingUrgentTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate >= today &&
          eventDate <= nextWeek &&
          (event.priority === "High" || event.priority === "Critical")
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventTypeColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "task":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "sprint":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "meeting":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "deadline":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "Critical":
        return "border-l-red-500";
      case "High":
        return "border-l-orange-500";
      case "Medium":
        return "border-l-yellow-500";
      case "Low":
        return "border-l-green-500";
      default:
        return "border-l-slate-300";
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const filterEvents = (d: Date) => {
    const date = d.toISOString().split("T")[0];
    return events.filter(
      (e) => e.date === date && (filterType === "all" || e.type === filterType)
    );
  };

  const calendarDays = getCalendarDays();
  const todaysEvents = getTodaysEvents();
  const upcomingUrgent = getUpcomingUrgentTasks();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy-900 dark:text-navy-100">
              Calendar
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track deadlines, sprints, and team events
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={filterType}
              onValueChange={(value: typeof filterType) => setFilterType(value)}
            >
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
                <SelectItem value="sprint">Sprints</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="deadline">Deadlines</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-navy-600 hover:bg-navy-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-navy-600" />
                    {currentDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("prev")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("next")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDate(day);
                    const isCurrentDay = isToday(day);
                    const isCurrentMonthDay = isCurrentMonth(day);

                    return (
                      <div
                        key={index}
                        className={cn(
                          "min-h-[100px] p-2 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                          isCurrentDay &&
                            "bg-navy-50 dark:bg-navy-900 border-navy-200 dark:border-navy-700",
                          !isCurrentMonthDay &&
                            "text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-800"
                        )}
                        onClick={() =>
                          setSelectedDate(day.toISOString().split("T")[0])
                        }
                      >
                        <div
                          className={cn(
                            "text-sm font-medium mb-1",
                            isCurrentDay && "text-navy-900 dark:text-navy-100"
                          )}
                        >
                          {day.getDate()}
                        </div>

                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={cn(
                                "text-xs p-1 rounded truncate border-l-2",
                                getEventTypeColor(event.type),
                                getPriorityColor(event.priority)
                              )}
                              title={event.title}
                            >
                              {event.time && (
                                <span className="font-medium mr-1">
                                  {formatTime(event.time)}
                                </span>
                              )}
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-navy-600" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysEvents.length > 0 ? (
                  <div className="space-y-3">
                    {todaysEvents.map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "p-3 rounded-lg border-l-4 bg-slate-50 dark:bg-slate-800",
                          getPriorityColor(event.priority)
                        )}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">
                            {event.title}
                          </h4>
                          <Badge
                            className={getEventTypeColor(event.type)}
                            variant="secondary"
                          >
                            {event.type}
                          </Badge>
                        </div>

                        {event.time && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                            {formatTime(event.time)}
                            {event.endTime && ` - ${formatTime(event.endTime)}`}
                          </p>
                        )}

                        {event.assignee && (
                          <div className="flex items-center gap-1 mt-2">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-xs">
                                {event.assignee.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              {event.assignee.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle2 className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No events scheduled for today
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Urgent Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Urgent This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingUrgent.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingUrgent.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm text-orange-900 dark:text-orange-100">
                            {event.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className="text-orange-800 border-orange-300 dark:text-orange-200 dark:border-orange-700"
                          >
                            {event.priority}
                          </Badge>
                        </div>

                        <p className="text-xs text-orange-700 dark:text-orange-300 mb-1">
                          Due:{" "}
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>

                        {event.assignee && (
                          <div className="flex items-center gap-1 mt-2">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-xs bg-orange-200 text-orange-800">
                                {event.assignee.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-orange-700 dark:text-orange-300">
                              {event.assignee.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Target className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No urgent tasks this week
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Workload Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-navy-600" />
                  Team Workload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "John Doe", tasks: 8, capacity: 10 },
                    { name: "Jane Smith", tasks: 12, capacity: 10 },
                    { name: "Mike Johnson", tasks: 6, capacity: 10 },
                  ].map((member) => (
                    <div key={member.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {member.name}
                          </span>
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {member.tasks}/{member.capacity}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all",
                            member.tasks > member.capacity
                              ? "bg-red-500"
                              : member.tasks === member.capacity
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          )}
                          style={{
                            width: `${Math.min(
                              (member.tasks / member.capacity) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
});
