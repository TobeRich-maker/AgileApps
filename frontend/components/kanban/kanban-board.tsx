"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  type Task,
  type TaskStatus,
  useSprintStore,
} from "@/lib/stores/sprint-store";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: "To Do", title: "To Do", color: "bg-gray-100" },
  { id: "In Progress", title: "In Progress", color: "bg-blue-100" },
  { id: "Done", title: "Done", color: "bg-green-100" },
];

interface KanbanBoardProps {
  onCreateTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function KanbanBoard({
  onCreateTask,
  onEditTask,
  onDeleteTask,
}: KanbanBoardProps) {
  const { tasks, moveTask } = useSprintStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;

    moveTask(taskId, newStatus);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{column.title}</h3>
                <Badge variant="secondary" className={column.color}>
                  {getTasksByStatus(column.id).length}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCreateTask(column.id)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] p-2 rounded-lg border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="space-y-3">
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`cursor-move transition-shadow ${
                              snapshot.isDragging
                                ? "shadow-lg"
                                : "hover:shadow-md"
                            }`}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-sm font-medium line-clamp-2">
                                  {task.title}
                                </CardTitle>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => onEditTask(task)}
                                    >
                                      Edit Task
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => onDeleteTask(task.id)}
                                      className="text-red-600"
                                    >
                                      Delete Task
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              {task.description && (
                                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className={getPriorityColor(task.priority)}
                                  >
                                    {task.priority}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {task.storyPoints} pts
                                  </Badge>
                                </div>

                                {task.assigneeName && (
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {task.assigneeName
                                        .charAt(0)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
