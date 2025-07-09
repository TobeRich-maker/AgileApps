"use client";

import type React from "react";

import { useState } from "react";
import { useSprintStore } from "@/lib/stores/sprint-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateSprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSprintDialog({
  open,
  onOpenChange,
}: CreateSprintDialogProps) {
  const { createSprint } = useSprintStore();
  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    start_date: "",
    end_date: "",
    duration: 14,
    status: "planned" as const,
    story_points: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createSprint(formData);
      setFormData({
        name: "",
        goal: "",
        start_date: "",
        end_date: "",
        duration: 14,
        status: "planned",
        story_points: 0,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create sprint:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Sprint</DialogTitle>
          <DialogDescription>
            Plan a new sprint for your development team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sprint Name</Label>
              <Input
                id="name"
                placeholder="e.g., Sprint 4 - User Dashboard"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Sprint Goal</Label>
              <Textarea
                id="goal"
                placeholder="What do you want to achieve in this sprint?"
                value={formData.goal}
                onChange={(e) => handleInputChange("goal", e.target.value)}
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    handleInputChange("start_date", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    handleInputChange("end_date", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange(
                      "duration",
                      Number.parseInt(e.target.value)
                    )
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="story_points">Target Story Points</Label>
                <Input
                  id="story_points"
                  type="number"
                  min="0"
                  value={formData.story_points}
                  onChange={(e) =>
                    handleInputChange(
                      "story_points",
                      Number.parseInt(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Sprint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
