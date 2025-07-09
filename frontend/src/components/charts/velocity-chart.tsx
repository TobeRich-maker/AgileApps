"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { sprint: "Sprint 1", planned: 25, completed: 23 },
  { sprint: "Sprint 2", planned: 30, completed: 28 },
  { sprint: "Sprint 3", planned: 32, completed: 32 },
  { sprint: "Sprint 4", planned: 28, completed: 26 },
  { sprint: "Sprint 5", planned: 35, completed: 30 },
];

export function VelocityChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sprint" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="planned" fill="#94a3b8" name="Planned" />
          <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
