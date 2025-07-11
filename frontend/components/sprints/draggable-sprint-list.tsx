"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Sprint } from "@/lib/types/api";
import { Calendar, Target, MoreHorizontal, GripVertical } from "lucide-react";

interface SortableSprintCardProps {
  sprint: Sprint;
  onEdit: (sprint: Sprint) => void;
  onDelete: (id: string) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}

function SortableSprintCard({
  sprint,
  onEdit,
  onDelete,
  onStart,
  onComplete,
}: SortableSprintCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sprint.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Planned":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`hover:shadow-md transition-shadow ${isDragging ? "opacity-50" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{sprint.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {sprint.goal}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(sprint)}>
                Edit Sprint
              </DropdownMenuItem>
              {sprint.status === "Planned" && (
                <DropdownMenuItem onClick={() => onStart(sprint.id)}>
                  Start Sprint
                </DropdownMenuItem>
              )}
              {sprint.status === "Active" && (
                <DropdownMenuItem onClick={() => onComplete(sprint.id)}>
                  Complete Sprint
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onDelete(sprint.id)}
                className="text-red-600"
              >
                Delete Sprint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(sprint.status)}>
              {sprint.status}
            </Badge>
            {sprint.status === "Active" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{getDaysRemaining(sprint.endDate)} days left</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {sprint.completedPoints}/{sprint.storyPoints} points
              </span>
            </div>
            <Progress
              value={(sprint.completedPoints / sprint.storyPoints) * 100}
              className="h-2"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>{sprint.storyPoints} story points</span>
            </div>
            <span>
              {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DraggableSprintListProps {
  sprints: Sprint[];
  onReorder: (sprints: Sprint[]) => void;
  onEdit: (sprint: Sprint) => void;
  onDelete: (id: string) => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}

export function DraggableSprintList({
  sprints,
  onReorder,
  onEdit,
  onDelete,
  onStart,
  onComplete,
}: DraggableSprintListProps) {
  const [items, setItems] = useState(sprints);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          order: index,
        }),
      );

      setItems(newItems);
      onReorder(newItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {items.map((sprint) => (
            <SortableSprintCard
              key={sprint.id}
              sprint={sprint}
              onEdit={onEdit}
              onDelete={onDelete}
              onStart={onStart}
              onComplete={onComplete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
