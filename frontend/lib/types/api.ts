// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// User Types
export type UserRole = "Admin" | "Developer" | "Manager" | "Guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// Project Types
export type ProjectDifficulty = "Easy" | "Medium" | "Hard" | "Extreme";
export type ProjectStatus = "Active" | "Completed" | "On Hold" | "Cancelled";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  difficulty: ProjectDifficulty;
  createdAt: string;
  updatedAt: string;
  teamMembers: User[];
  sprintCount: number;
  ownerId: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  status: ProjectStatus;
  difficulty: ProjectDifficulty;
  teamMemberIds: string[];
}

// Sprint Types
export type SprintStatus = "Not Started" | "In Progress" | "Completed";

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  storyPoints: number;
  completedPoints: number;
  projectId: string;
  order: number;
  tasks: Task[];
}

export interface CreateSprintRequest {
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  storyPoints: number;
  projectId: string;
}

export interface UpdateSprintOrderRequest {
  sprintId: string;
  newOrder: number;
}

// Task Types
export type TaskStatus = "To Do" | "In Progress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints: number;
  assigneeId?: string;
  assignee?: User;
  sprintId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints: number;
  assigneeId?: string;
  sprintId: string;
  dueDate?: string;
}

// Role Types
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "task_deadline" | "sprint_event" | "task_assignment" | "general";
  read: boolean;
  userId: string;
  createdAt: string;
  metadata?: {
    taskId?: string;
    sprintId?: string;
    projectId?: string;
  };
}
