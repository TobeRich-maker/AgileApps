// Comprehensive dummy data for reports and analytics

export const velocityData = [
  { sprint: "Sprint 19", planned: 25, completed: 23, team: "Team Alpha" },
  { sprint: "Sprint 20", planned: 30, completed: 28, team: "Team Alpha" },
  { sprint: "Sprint 21", planned: 28, completed: 30, team: "Team Alpha" },
  { sprint: "Sprint 22", planned: 32, completed: 29, team: "Team Alpha" },
  { sprint: "Sprint 23", planned: 35, completed: 33, team: "Team Alpha" },
  { sprint: "Sprint 24", planned: 38, completed: 36, team: "Team Alpha" },
];

export const burndownData = [
  { day: 1, remaining: 120, ideal: 120 },
  { day: 2, remaining: 115, ideal: 112 },
  { day: 3, remaining: 108, ideal: 104 },
  { day: 4, remaining: 102, ideal: 96 },
  { day: 5, remaining: 98, ideal: 88 },
  { day: 6, remaining: 92, ideal: 80 },
  { day: 7, remaining: 88, ideal: 72 },
  { day: 8, remaining: 82, ideal: 64 },
  { day: 9, remaining: 76, ideal: 56 },
  { day: 10, remaining: 68, ideal: 48 },
  { day: 11, remaining: 62, ideal: 40 },
  { day: 12, remaining: 54, ideal: 32 },
  { day: 13, remaining: 46, ideal: 24 },
  { day: 14, remaining: 38, ideal: 16 },
  { day: 15, remaining: 28, ideal: 8 },
  { day: 16, remaining: 18, ideal: 0 },
];

export const teamPerformanceData = [
  {
    member: "John Doe",
    tasksCompleted: 24,
    storyPoints: 89,
    avgTaskTime: 2.3,
    efficiency: 92,
    role: "Frontend Developer",
  },
  {
    member: "Jane Smith",
    tasksCompleted: 28,
    storyPoints: 95,
    avgTaskTime: 2.1,
    efficiency: 88,
    role: "Backend Developer",
  },
  {
    member: "Mike Johnson",
    tasksCompleted: 22,
    storyPoints: 76,
    avgTaskTime: 2.8,
    efficiency: 85,
    role: "Full Stack Developer",
  },
  {
    member: "Sarah Wilson",
    tasksCompleted: 26,
    storyPoints: 82,
    avgTaskTime: 2.4,
    efficiency: 90,
    role: "UI/UX Designer",
  },
  {
    member: "David Brown",
    tasksCompleted: 20,
    storyPoints: 68,
    avgTaskTime: 3.1,
    efficiency: 82,
    role: "QA Engineer",
  },
];

export const projectHealthData = [
  {
    project: "E-commerce Platform",
    health: 85,
    velocity: 32,
    burndownTrend: "on-track",
    riskLevel: "low",
    completionDate: "2024-06-30",
    budget: 95000,
    spent: 68000,
  },
  {
    project: "Mobile Banking App",
    health: 78,
    velocity: 28,
    burndownTrend: "behind",
    riskLevel: "medium",
    completionDate: "2024-08-15",
    budget: 120000,
    spent: 85000,
  },
  {
    project: "Analytics Dashboard",
    health: 92,
    velocity: 35,
    burndownTrend: "ahead",
    riskLevel: "low",
    completionDate: "2024-05-20",
    budget: 75000,
    spent: 45000,
  },
];

export const resourceUtilizationData = [
  { month: "Jan", frontend: 85, backend: 92, design: 78, qa: 88 },
  { month: "Feb", frontend: 88, backend: 89, design: 82, qa: 85 },
  { month: "Mar", frontend: 92, backend: 94, design: 85, qa: 90 },
  { month: "Apr", frontend: 87, backend: 91, design: 88, qa: 87 },
  { month: "May", frontend: 90, backend: 88, design: 90, qa: 92 },
  { month: "Jun", frontend: 93, backend: 95, design: 87, qa: 89 },
];

export const cumulativeFlowData = [
  { week: "Week 1", todo: 45, inProgress: 12, done: 8 },
  { week: "Week 2", todo: 42, inProgress: 15, done: 18 },
  { week: "Week 3", todo: 38, inProgress: 18, done: 29 },
  { week: "Week 4", todo: 35, inProgress: 16, done: 39 },
  { week: "Week 5", todo: 32, inProgress: 14, done: 48 },
  { week: "Week 6", todo: 28, inProgress: 12, done: 58 },
  { week: "Week 7", todo: 24, inProgress: 10, done: 68 },
  { week: "Week 8", todo: 20, inProgress: 8, done: 78 },
];

export const defectTrendData = [
  { sprint: "Sprint 19", found: 8, fixed: 6, remaining: 2 },
  { sprint: "Sprint 20", found: 12, fixed: 10, remaining: 4 },
  { sprint: "Sprint 21", found: 6, fixed: 8, remaining: 2 },
  { sprint: "Sprint 22", found: 9, fixed: 7, remaining: 4 },
  { sprint: "Sprint 23", found: 5, fixed: 6, remaining: 3 },
  { sprint: "Sprint 24", found: 7, fixed: 5, remaining: 5 },
];

export const sprintCompletionData = [
  { sprint: "Sprint 19", planned: 25, completed: 23, carryover: 2 },
  { sprint: "Sprint 20", planned: 30, completed: 28, carryover: 2 },
  { sprint: "Sprint 21", planned: 28, completed: 30, carryover: 0 },
  { sprint: "Sprint 22", planned: 32, completed: 29, carryover: 3 },
  { sprint: "Sprint 23", planned: 35, completed: 33, carryover: 2 },
  { sprint: "Sprint 24", planned: 38, completed: 36, carryover: 2 },
];

export const taskDistributionData = [
  { type: "Feature", count: 45, percentage: 52 },
  { type: "Bug Fix", count: 18, percentage: 21 },
  { type: "Technical Debt", count: 12, percentage: 14 },
  { type: "Documentation", count: 8, percentage: 9 },
  { type: "Testing", count: 4, percentage: 4 },
];

export const difficultyDistributionData = [
  { difficulty: "Easy", count: 28, color: "#10B981" },
  { difficulty: "Medium", count: 35, color: "#F59E0B" },
  { difficulty: "Hard", count: 22, color: "#EF4444" },
  { difficulty: "Extreme", count: 8, color: "#7C2D12" },
];

export const timeTrackingData = [
  {
    task: "User Authentication",
    estimated: 16,
    actual: 18,
    efficiency: 89,
    developer: "John Doe",
  },
  {
    task: "Payment Integration",
    estimated: 24,
    actual: 22,
    efficiency: 109,
    developer: "Jane Smith",
  },
  {
    task: "Dashboard Layout",
    estimated: 12,
    actual: 14,
    efficiency: 86,
    developer: "Mike Johnson",
  },
  {
    task: "API Documentation",
    estimated: 8,
    actual: 6,
    efficiency: 133,
    developer: "Sarah Wilson",
  },
];

export const clientSatisfactionData = [
  { month: "Jan", satisfaction: 4.2, feedback: 12 },
  { month: "Feb", satisfaction: 4.4, feedback: 15 },
  { month: "Mar", satisfaction: 4.1, feedback: 18 },
  { month: "Apr", satisfaction: 4.6, feedback: 14 },
  { month: "May", satisfaction: 4.5, feedback: 16 },
  { month: "Jun", satisfaction: 4.7, feedback: 19 },
];

export const budgetTrackingData = [
  {
    category: "Development",
    budgeted: 150000,
    spent: 125000,
    remaining: 25000,
  },
  { category: "Design", budgeted: 50000, spent: 42000, remaining: 8000 },
  { category: "Testing", budgeted: 30000, spent: 28000, remaining: 2000 },
  {
    category: "Infrastructure",
    budgeted: 25000,
    spent: 22000,
    remaining: 3000,
  },
  {
    category: "Tools & Licenses",
    budgeted: 15000,
    spent: 13000,
    remaining: 2000,
  },
];

// Activity heatmap data for productivity tracking
export const activityHeatmapData = Array.from({ length: 365 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (364 - i));

  return {
    date: date.toISOString().split("T")[0],
    count: Math.floor(Math.random() * 10), // 0-9 tasks completed
    level: Math.floor(Math.random() * 5), // 0-4 intensity level
  };
});

// Weekly activity summary
export const weeklyActivityData = [
  { day: "Mon", tasks: 8, hours: 7.5 },
  { day: "Tue", tasks: 12, hours: 8.2 },
  { day: "Wed", tasks: 6, hours: 6.8 },
  { day: "Thu", tasks: 10, hours: 8.0 },
  { day: "Fri", tasks: 9, hours: 7.3 },
  { day: "Sat", tasks: 3, hours: 2.5 },
  { day: "Sun", tasks: 1, hours: 1.0 },
];

// Monthly productivity trends
export const monthlyProductivityData = [
  { month: "Jan", tasksCompleted: 156, hoursWorked: 168, efficiency: 93 },
  { month: "Feb", tasksCompleted: 142, hoursWorked: 152, efficiency: 93 },
  { month: "Mar", tasksCompleted: 178, hoursWorked: 184, efficiency: 97 },
  { month: "Apr", tasksCompleted: 165, hoursWorked: 172, efficiency: 96 },
  { month: "May", tasksCompleted: 189, hoursWorked: 176, efficiency: 107 },
  { month: "Jun", tasksCompleted: 172, hoursWorked: 168, efficiency: 102 },
];
