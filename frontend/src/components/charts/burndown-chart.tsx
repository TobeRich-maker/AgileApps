"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { day: "Day 1", ideal: 45, actual: 45 },
  { day: "Day 2", ideal: 42, actual: 43 },
  { day: "Day 3", ideal: 39, actual: 40 },
  { day: "Day 4", ideal: 36, actual: 35 },
  { day: "Day 5", ideal: 33, actual: 32 },
  { day: "Day 6", ideal: 30, actual: 28 },
  { day: "Day 7", ideal: 27, actual: 25 },
  { day: "Day 8", ideal: 24, actual: 22 },
  { day: "Day 9", ideal: 21, actual: 20 },
  { day: "Day 10", ideal: 18, actual: 15 },
  { day: "Day 11", ideal: 15, actual: 13 },
  { day: "Day 12", ideal: 12, actual: 10 },
  { day: "Day 13", ideal: 9, actual: 8 },
  { day: "Day 14", ideal: 6, actual: 5 },
];

export function BurndownChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ideal"
            stroke="#94a3b8"
            strokeDasharray="5 5"
            name="Ideal Burndown"
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Actual Burndown"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
