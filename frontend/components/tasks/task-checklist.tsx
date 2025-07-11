"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CheckSquare, Plus, X, AlertCircle } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  required: boolean;
  completedBy?: string;
  completedAt?: string;
}

interface TaskChecklistProps {
  taskId: string;
}

const defaultChecklist: ChecklistItem[] = [
  {
    id: "1",
    title: "Code Review",
    description: "Code has been reviewed by at least one team member",
    completed: true,
    required: true,
    completedBy: "Jane Smith",
    completedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    title: "Unit Tests",
    description: "Unit tests written and passing with >80% coverage",
    completed: true,
    required: true,
    completedBy: "John Doe",
    completedAt: "2024-01-20T11:30:00Z",
  },
  {
    id: "3",
    title: "QA Testing",
    description: "Manual testing completed and bugs resolved",
    completed: false,
    required: true,
  },
  {
    id: "4",
    title: "Deployed to Staging",
    description: "Feature deployed to staging environment",
    completed: false,
    required: true,
  },
  {
    id: "5",
    title: "Documentation Updated",
    description: "Technical documentation and user guides updated",
    completed: false,
    required: false,
  },
];

export function TaskChecklist({ taskId }: TaskChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    required: false,
  });

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const requiredCount = checklist.filter((item) => item.required).length;
  const completedRequiredCount = checklist.filter(
    (item) => item.required && item.completed,
  ).length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggleItem = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            completed: !item.completed,
            completedBy: !item.completed ? "Current User" : undefined,
            completedAt: !item.completed ? new Date().toISOString() : undefined,
          };
        }
        return item;
      }),
    );
  };

  const handleAddItem = () => {
    if (!newItem.title.trim()) return;

    const item: ChecklistItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description || undefined,
      completed: false,
      required: newItem.required,
    };

    setChecklist((prev) => [...prev, item]);
    setNewItem({ title: "", description: "", required: false });
    setIsAddingItem(false);
  };

  const handleRemoveItem = (itemId: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== itemId));
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

  const isTaskReady = completedRequiredCount === requiredCount;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-green-600" />
            QA Checklist
          </CardTitle>
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Checklist Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newItem.title}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter checklist item title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter description"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="required"
                    checked={newItem.required}
                    onCheckedChange={(checked) =>
                      setNewItem((prev) => ({
                        ...prev,
                        required: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="required">Required for completion</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingItem(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddItem}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Add Item
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>
              Progress: {completedCount}/{totalCount} completed
            </span>
            <span className="text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              Required: {completedRequiredCount}/{requiredCount}
            </span>
            {isTaskReady ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Ready for deployment
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 flex items-center gap-1"
              >
                <AlertCircle className="h-3 w-3" />
                Pending requirements
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {checklist.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50"
          >
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => handleToggleItem(item.id)}
              className="mt-0.5"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-sm font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {item.title}
                </span>
                {item.required && (
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>

              {item.description && (
                <p
                  className={`text-xs text-muted-foreground mb-2 ${item.completed ? "line-through" : ""}`}
                >
                  {item.description}
                </p>
              )}

              {item.completed && item.completedBy && (
                <div className="text-xs text-muted-foreground">
                  Completed by {item.completedBy}{" "}
                  {item.completedAt && formatTimeAgo(item.completedAt)}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={() => handleRemoveItem(item.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {checklist.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              No checklist items yet. Add items to track task completion.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
