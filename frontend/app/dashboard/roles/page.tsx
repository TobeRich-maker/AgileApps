"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Plus, Search, MoreHorizontal, Shield, Users, Loader2 } from "lucide-react"
import type { Role } from "@/lib/types/api"

// Mock data
const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full system access with all permissions",
    permissions: ["create_project", "delete_project", "manage_users", "manage_roles", "view_reports"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Scrum Master",
    description: "Manage sprints and facilitate team processes",
    permissions: ["create_sprint", "manage_sprint", "view_reports", "assign_tasks"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Product Owner",
    description: "Define product requirements and priorities",
    permissions: ["create_project", "manage_backlog", "view_reports", "prioritize_tasks"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Developer",
    description: "Develop features and fix bugs",
    permissions: ["view_tasks", "update_task_status", "comment_tasks"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Designer",
    description: "Create designs and user experience",
    permissions: ["view_tasks", "update_task_status", "upload_designs"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

const availablePermissions = [
  "create_project",
  "delete_project",
  "manage_users",
  "manage_roles",
  "view_reports",
  "create_sprint",
  "manage_sprint",
  "assign_tasks",
  "manage_backlog",
  "prioritize_tasks",
  "view_tasks",
  "update_task_status",
  "comment_tasks",
  "upload_designs",
]

export default function RolesPage() {
  const { user } = useAuthStore()
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  // Check if user is admin
  const isAdmin = user?.role === "Admin"

  useEffect(() => {
    if (!isAdmin) {
      // Redirect non-admin users
      window.location.href = "/dashboard"
    }
  }, [isAdmin])

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateRole = () => {
    setEditingRole(null)
    setFormData({ name: "", description: "", permissions: [] })
    setIsCreateDialogOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    })
    setIsCreateDialogOpen(true)
  }

  const handleDeleteRole = async (roleId: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      try {
        setIsLoading(true)
        // In real app: await rolesApi.delete(roleId)
        setRoles((prev) => prev.filter((role) => role.id !== roleId))
      } catch (error) {
        console.error("Failed to delete role:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (editingRole) {
        // Update existing role
        const updatedRole: Role = {
          ...editingRole,
          ...formData,
          updatedAt: new Date().toISOString(),
        }
        setRoles((prev) => prev.map((role) => (role.id === editingRole.id ? updatedRole : role)))
      } else {
        // Create new role
        const newRole: Role = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setRoles((prev) => [...prev, newRole])
      }

      setIsCreateDialogOpen(false)
      setFormData({ name: "", description: "", permissions: [] })
    } catch (error) {
      console.error("Failed to save role:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked ? [...prev.permissions, permission] : prev.permissions.filter((p) => p !== permission),
    }))
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
            <p className="text-muted-foreground">Manage user roles and permissions.</p>
          </div>
          <Button onClick={handleCreateRole} className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            New Role
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{role.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace("_", " ")}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditRole(role)}>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteRole(role.id)} className="text-red-600">
                          Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">No roles found.</p>
          </div>
        )}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
              <DialogDescription>
                {editingRole
                  ? "Update the role details and permissions."
                  : "Define a new role with specific permissions."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter role name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter role description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                    {availablePermissions.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          checked={formData.permissions.includes(permission)}
                          onCheckedChange={(checked) => handlePermissionChange(permission, checked as boolean)}
                        />
                        <Label htmlFor={permission} className="text-sm">
                          {permission.replace("_", " ")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingRole ? "Update Role" : "Create Role"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
