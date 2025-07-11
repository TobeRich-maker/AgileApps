"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Repeat, Clock, AlertCircle } from "lucide-react";

interface RecurringTaskFormProps {
  onRecurrenceChange: (recurrence: RecurrenceConfig | null) => void;
  initialRecurrence?: RecurrenceConfig | null;
}

export interface RecurrenceConfig {
  enabled: boolean;
  type: "daily" | "weekly" | "sprint";
  interval: number;
  endType: "never" | "after" | "on";
  endValue?: number | string;
  weekdays?: number[]; // For weekly recurrence
}

export function RecurringTaskForm({
  onRecurrenceChange,
  initialRecurrence,
}: RecurringTaskFormProps) {
  const [recurrence, setRecurrence] = useState<RecurrenceConfig>(
    initialRecurrence || {
      enabled: false,
      type: "weekly",
      interval: 1,
      endType: "never",
    },
  );

  const updateRecurrence = (updates: Partial<RecurrenceConfig>) => {
    const newRecurrence = { ...recurrence, ...updates };
    setRecurrence(newRecurrence);
    onRecurrenceChange(newRecurrence.enabled ? newRecurrence : null);
  };

  const getRecurrencePreview = () => {
    if (!recurrence.enabled) return null;

    let preview = "";

    switch (recurrence.type) {
      case "daily":
        preview =
          recurrence.interval === 1
            ? "Every day"
            : `Every ${recurrence.interval} days`;
        break;
      case "weekly":
        const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        if (recurrence.weekdays && recurrence.weekdays.length > 0) {
          const days = recurrence.weekdays
            .map((d) => weekdayNames[d])
            .join(", ");
          preview = `Every ${recurrence.interval === 1 ? "" : `${recurrence.interval} `}week${recurrence.interval > 1 ? "s" : ""} on ${days}`;
        } else {
          preview = `Every ${recurrence.interval === 1 ? "" : `${recurrence.interval} `}week${recurrence.interval > 1 ? "s" : ""}`;
        }
        break;
      case "sprint":
        preview =
          recurrence.interval === 1
            ? "Every sprint"
            : `Every ${recurrence.interval} sprints`;
        break;
    }

    if (recurrence.endType === "after" && recurrence.endValue) {
      preview += ` for ${recurrence.endValue} occurrence${recurrence.endValue > 1 ? "s" : ""}`;
    } else if (recurrence.endType === "on" && recurrence.endValue) {
      preview += ` until ${recurrence.endValue}`;
    }

    return preview;
  };

  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="h-5 w-5 text-navy-600" />
          Recurring Task
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="recurring-enabled">Enable recurring task</Label>
          <Switch
            id="recurring-enabled"
            checked={recurrence.enabled}
            onCheckedChange={(enabled) => updateRecurrence({ enabled })}
          />
        </div>

        {recurrence.enabled && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Repeat every</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={recurrence.interval}
                    onChange={(e) =>
                      updateRecurrence({
                        interval: Number.parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-20"
                  />
                  <Select
                    value={recurrence.type}
                    onValueChange={(type: "daily" | "weekly" | "sprint") =>
                      updateRecurrence({ type })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Day(s)</SelectItem>
                      <SelectItem value="weekly">Week(s)</SelectItem>
                      <SelectItem value="sprint">Sprint(s)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ends</Label>
                <Select
                  value={recurrence.endType}
                  onValueChange={(endType: "never" | "after" | "on") =>
                    updateRecurrence({ endType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="after">After</SelectItem>
                    <SelectItem value="on">On date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {recurrence.type === "weekly" && (
              <div className="space-y-2">
                <Label>Repeat on</Label>
                <div className="flex flex-wrap gap-2">
                  {weekdayNames.map((day, index) => (
                    <Button
                      key={day}
                      variant={
                        recurrence.weekdays?.includes(index)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        const current = recurrence.weekdays || [];
                        const updated = current.includes(index)
                          ? current.filter((d) => d !== index)
                          : [...current, index].sort();
                        updateRecurrence({ weekdays: updated });
                      }}
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {recurrence.endType === "after" && (
              <div className="space-y-2">
                <Label>Number of occurrences</Label>
                <Input
                  type="number"
                  min="1"
                  value={recurrence.endValue || ""}
                  onChange={(e) =>
                    updateRecurrence({
                      endValue: Number.parseInt(e.target.value) || undefined,
                    })
                  }
                  placeholder="Enter number"
                />
              </div>
            )}

            {recurrence.endType === "on" && (
              <div className="space-y-2">
                <Label>End date</Label>
                <Input
                  type="date"
                  value={recurrence.endValue || ""}
                  onChange={(e) =>
                    updateRecurrence({ endValue: e.target.value })
                  }
                />
              </div>
            )}

            {/* Preview */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Preview
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {getRecurrencePreview() ||
                  "Configure recurrence settings above"}
              </p>
            </div>

            {/* Warning for sprint-based recurrence */}
            {recurrence.type === "sprint" && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Sprint-based recurrence
                  </p>
                  <p className="text-amber-700 dark:text-amber-300">
                    New tasks will be created automatically when sprints start
                    based on your project's sprint schedule.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component to display recurrence info on task cards
export function RecurrenceIndicator({
  recurrence,
}: {
  recurrence: RecurrenceConfig;
}) {
  if (!recurrence.enabled) return null;

  const getShortDescription = () => {
    switch (recurrence.type) {
      case "daily":
        return recurrence.interval === 1
          ? "Daily"
          : `Every ${recurrence.interval}d`;
      case "weekly":
        return recurrence.interval === 1
          ? "Weekly"
          : `Every ${recurrence.interval}w`;
      case "sprint":
        return recurrence.interval === 1
          ? "Every sprint"
          : `Every ${recurrence.interval} sprints`;
      default:
        return "Recurring";
    }
  };

  return (
    <Badge
      variant="secondary"
      className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    >
      <Repeat className="h-3 w-3 mr-1" />
      {getShortDescription()}
    </Badge>
  );
}
