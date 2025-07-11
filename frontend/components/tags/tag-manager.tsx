"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tag,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Hash,
  Palette,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TagData {
  id: string;
  name: string;
  color: string;
  description?: string;
  category: string;
  usageCount: number;
  createdAt: string;
  createdBy: string;
}

// Mock tags data
const mockTags: TagData[] = [
  {
    id: "1",
    name: "frontend",
    color: "#3B82F6",
    description: "Frontend development tasks",
    category: "Development",
    usageCount: 45,
    createdAt: "2024-01-15",
    createdBy: "John Doe",
  },
  {
    id: "2",
    name: "backend",
    color: "#10B981",
    description: "Backend development tasks",
    category: "Development",
    usageCount: 38,
    createdAt: "2024-01-14",
    createdBy: "Jane Smith",
  },
  {
    id: "3",
    name: "urgent",
    color: "#EF4444",
    description: "High priority urgent tasks",
    category: "Priority",
    usageCount: 23,
    createdAt: "2024-01-12",
    createdBy: "Mike Johnson",
  },
  {
    id: "4",
    name: "bug",
    color: "#F59E0B",
    description: "Bug fixes and issues",
    category: "Type",
    usageCount: 67,
    createdAt: "2024-01-10",
    createdBy: "Sarah Wilson",
  },
  {
    id: "5",
    name: "feature",
    color: "#8B5CF6",
    description: "New feature development",
    category: "Type",
    usageCount: 89,
    createdAt: "2024-01-08",
    createdBy: "David Brown",
  },
  {
    id: "6",
    name: "testing",
    color: "#06B6D4",
    description: "Testing and QA tasks",
    category: "Development",
    usageCount: 34,
    createdAt: "2024-01-05",
    createdBy: "Lisa Chen",
  },
  {
    id: "7",
    name: "documentation",
    color: "#84CC16",
    description: "Documentation tasks",
    category: "Documentation",
    usageCount: 28,
    createdAt: "2024-01-03",
    createdBy: "Tom Wilson",
  },
  {
    id: "8",
    name: "api",
    color: "#F97316",
    description: "API development and integration",
    category: "Development",
    usageCount: 42,
    createdAt: "2024-01-01",
    createdBy: "Anna Davis",
  },
];

const colorOptions = [
  "#3B82F6",
  "#10B981",
  "#EF4444",
  "#F59E0B",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#EC4899",
  "#6366F1",
];

export function TagManager() {
  const [tags, setTags] = useState<TagData[]>(mockTags);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  const [newTag, setNewTag] = useState<Partial<TagData>>({
    name: "",
    color: colorOptions[0],
    description: "",
    category: "Development",
  });

  // Filter tags
  const filteredTags = tags.filter((tag) => {
    const matchesSearch =
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || tag.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(tags.map((t) => t.category)));

  const createTag = () => {
    if (!newTag.name) return;

    const tag: TagData = {
      id: Date.now().toString(),
      name: newTag.name.toLowerCase().replace(/\s+/g, "-"),
      color: newTag.color || colorOptions[0],
      description: newTag.description,
      category: newTag.category || "Development",
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "Current User",
    };

    setTags((prev) => [tag, ...prev]);
    setNewTag({
      name: "",
      color: colorOptions[0],
      description: "",
      category: "Development",
    });
    setIsCreateDialogOpen(false);
  };

  const updateTag = () => {
    if (!editingTag || !newTag.name) return;

    setTags((prev) =>
      prev.map((tag) =>
        tag.id === editingTag.id
          ? {
              ...tag,
              name: newTag.name!.toLowerCase().replace(/\s+/g, "-"),
              color: newTag.color || tag.color,
              description: newTag.description,
              category: newTag.category || tag.category,
            }
          : tag,
      ),
    );

    setEditingTag(null);
    setNewTag({
      name: "",
      color: colorOptions[0],
      description: "",
      category: "Development",
    });
  };

  const deleteTag = (tagId: string) => {
    setTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  const openEditDialog = (tag: TagData) => {
    setEditingTag(tag);
    setNewTag({
      name: tag.name,
      color: tag.color,
      description: tag.description,
      category: tag.category,
    });
  };

  const resetForm = () => {
    setNewTag({
      name: "",
      color: colorOptions[0],
      description: "",
      category: "Development",
    });
    setEditingTag(null);
  };

  // Sort tags by usage count
  const sortedTags = [...filteredTags].sort(
    (a, b) => b.usageCount - a.usageCount,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-navy-100">
            Tag Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create and manage tags for better task organization
          </p>
        </div>
        <Dialog
          open={isCreateDialogOpen || !!editingTag}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-navy-600 hover:bg-navy-700"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingTag ? "Edit Tag" : "Create New Tag"}
              </DialogTitle>
              <DialogDescription>
                {editingTag
                  ? "Update the tag details."
                  : "Create a new tag for organizing tasks."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tag Name</Label>
                <Input
                  value={newTag.name || ""}
                  onChange={(e) =>
                    setNewTag({ ...newTag, name: e.target.value })
                  }
                  placeholder="Enter tag name (e.g., frontend, urgent)"
                />
              </div>

              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewTag({ ...newTag, color })}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        newTag.color === color
                          ? "border-slate-900 dark:border-slate-100 scale-110"
                          : "border-slate-300 dark:border-slate-600",
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={newTag.category || "Development"}
                  onValueChange={(category) =>
                    setNewTag({ ...newTag, category })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Priority">Priority</SelectItem>
                    <SelectItem value="Type">Type</SelectItem>
                    <SelectItem value="Documentation">Documentation</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description (Optional)</Label>
                <Input
                  value={newTag.description || ""}
                  onChange={(e) =>
                    setNewTag({ ...newTag, description: e.target.value })
                  }
                  placeholder="Brief description of when to use this tag"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={editingTag ? updateTag : createTag}>
                {editingTag ? "Update Tag" : "Create Tag"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total Tags
                </p>
                <p className="text-2xl font-bold text-navy-900 dark:text-navy-100">
                  {tags.length}
                </p>
              </div>
              <div className="p-2 bg-navy-100 dark:bg-navy-800 rounded-lg">
                <Tag className="h-5 w-5 text-navy-600 dark:text-navy-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Categories
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {categories.length}
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Most Used
                </p>
                <p className="text-lg font-bold text-green-600">
                  {tags.length > 0
                    ? tags.reduce((max, tag) =>
                        tag.usageCount > max.usageCount ? tag : max,
                      ).name
                    : "N/A"}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <Palette className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total Usage
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {tags.reduce((sum, tag) => sum + tag.usageCount, 0)}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedTags.map((tag) => (
          <Card key={tag.id} className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <Badge
                    variant="secondary"
                    className="font-mono text-xs"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                      borderColor: `${tag.color}40`,
                    }}
                  >
                    #{tag.name}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Tag className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(tag)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Tag
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteTag(tag.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Tag
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {tag.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {tag.description}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Category
                  </span>
                  <Badge variant="outline">{tag.category}</Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Usage
                  </span>
                  <span className="font-medium">{tag.usageCount} times</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Created by
                  </span>
                  <span className="font-medium">{tag.createdBy}</span>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Created {new Date(tag.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedTags.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Tag className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No tags found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "Create your first tag to get started"}
          </p>
        </div>
      )}
    </div>
  );
}
