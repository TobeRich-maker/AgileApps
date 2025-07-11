"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  X,
  Settings,
  Type,
  Hash,
  Calendar,
  List,
  ToggleLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface CustomField {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "select" | "boolean" | "textarea";
  required: boolean;
  options?: string[]; // For select type
  defaultValue?: string | number | boolean;
}

export interface CustomFieldValue {
  fieldId: string;
  value: string | number | boolean;
}

interface CustomFieldsFormProps {
  fields: CustomField[];
  values: CustomFieldValue[];
  onFieldsChange: (fields: CustomField[]) => void;
  onValuesChange: (values: CustomFieldValue[]) => void;
  editable?: boolean;
}

export function CustomFieldsForm({
  fields,
  values,
  onFieldsChange,
  onValuesChange,
  editable = true,
}: CustomFieldsFormProps) {
  const [isManaging, setIsManaging] = useState(false);
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: "",
    type: "text",
    required: false,
    options: [],
  });

  const getFieldIcon = (type: CustomField["type"]) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" />;
      case "textarea":
        return <Type className="h-4 w-4" />;
      case "number":
        return <Hash className="h-4 w-4" />;
      case "date":
        return <Calendar className="h-4 w-4" />;
      case "select":
        return <List className="h-4 w-4" />;
      case "boolean":
        return <ToggleLeft className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  const addField = () => {
    if (!newField.name) return;

    const field: CustomField = {
      id: `field-${Date.now()}`,
      name: newField.name,
      type: newField.type || "text",
      required: newField.required || false,
      options: newField.options || [],
      defaultValue: newField.defaultValue,
    };

    onFieldsChange([...fields, field]);
    setNewField({ name: "", type: "text", required: false, options: [] });
  };

  const removeField = (fieldId: string) => {
    onFieldsChange(fields.filter((f) => f.id !== fieldId));
    onValuesChange(values.filter((v) => v.fieldId !== fieldId));
  };

  const updateFieldValue = (
    fieldId: string,
    value: string | number | boolean,
  ) => {
    const existingIndex = values.findIndex((v) => v.fieldId === fieldId);
    const newValues = [...values];

    if (existingIndex >= 0) {
      newValues[existingIndex] = { fieldId, value };
    } else {
      newValues.push({ fieldId, value });
    }

    onValuesChange(newValues);
  };

  const getFieldValue = (fieldId: string) => {
    const fieldValue = values.find((v) => v.fieldId === fieldId);
    return fieldValue?.value;
  };

  const renderFieldInput = (field: CustomField) => {
    const value = getFieldValue(field.id);

    switch (field.type) {
      case "text":
        return (
          <Input
            value={(value as string) || ""}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            disabled={!editable}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={(value as string) || ""}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            disabled={!editable}
            rows={3}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={(value as number) || ""}
            onChange={(e) =>
              updateFieldValue(field.id, Number.parseFloat(e.target.value) || 0)
            }
            placeholder={`Enter ${field.name.toLowerCase()}`}
            disabled={!editable}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={(value as string) || ""}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            disabled={!editable}
          />
        );

      case "select":
        return (
          <Select
            value={(value as string) || ""}
            onValueChange={(val) => updateFieldValue(field.id, val)}
            disabled={!editable}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={(value as boolean) || false}
              onCheckedChange={(checked) => updateFieldValue(field.id, checked)}
              disabled={!editable}
            />
            <Label>{value ? "Yes" : "No"}</Label>
          </div>
        );

      default:
        return null;
    }
  };

  if (fields.length === 0 && !editable) {
    return null;
  }

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 dark:text-slate-100">
            <Settings className="h-5 w-5 text-navy-600 dark:text-navy-400" />
            Custom Fields
          </CardTitle>
          {editable && (
            <Dialog open={isManaging} onOpenChange={setIsManaging}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Fields
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Manage Custom Fields</DialogTitle>
                  <DialogDescription>
                    Add, edit, or remove custom fields for tasks.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Existing Fields */}
                  {fields.length > 0 && (
                    <div className="space-y-2">
                      <Label>Existing Fields</Label>
                      {fields.map((field) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            {getFieldIcon(field.type)}
                            <span className="font-medium">{field.name}</span>
                            <Badge variant="secondary">{field.type}</Badge>
                            {field.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(field.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Field */}
                  <div className="space-y-3 p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
                    <Label>Add New Field</Label>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Field Name</Label>
                        <Input
                          value={newField.name || ""}
                          onChange={(e) =>
                            setNewField({ ...newField, name: e.target.value })
                          }
                          placeholder="Field name"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Type</Label>
                        <Select
                          value={newField.type || "text"}
                          onValueChange={(type: CustomField["type"]) =>
                            setNewField({ ...newField, type })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="textarea">Long Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="select">Dropdown</SelectItem>
                            <SelectItem value="boolean">Yes/No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {newField.type === "select" && (
                      <div>
                        <Label className="text-xs">
                          Options (comma-separated)
                        </Label>
                        <Input
                          value={newField.options?.join(", ") || ""}
                          onChange={(e) =>
                            setNewField({
                              ...newField,
                              options: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newField.required || false}
                          onCheckedChange={(required) =>
                            setNewField({ ...newField, required })
                          }
                        />
                        <Label className="text-xs">Required field</Label>
                      </div>
                      <Button
                        onClick={addField}
                        size="sm"
                        disabled={!newField.name}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Field
                      </Button>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={() => setIsManaging(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      {fields.length > 0 && (
        <CardContent className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label className="flex items-center gap-2">
                {getFieldIcon(field.type)}
                {field.name}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              {renderFieldInput(field)}
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

// Hook to manage custom fields
export function useCustomFields() {
  const [fields, setFields] = useState<CustomField[]>([
    {
      id: "field-1",
      name: "Estimate Hours",
      type: "number",
      required: false,
    },
    {
      id: "field-2",
      name: "Client Name",
      type: "select",
      required: false,
      options: ["Internal", "Client A", "Client B", "Client C"],
    },
    {
      id: "field-3",
      name: "Testing Required",
      type: "boolean",
      required: false,
    },
  ]);

  const [values, setValues] = useState<CustomFieldValue[]>([]);

  return {
    fields,
    values,
    setFields,
    setValues,
  };
}
