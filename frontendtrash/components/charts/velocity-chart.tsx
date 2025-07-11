"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface VelocityChartProps {
  data: Array<{
    sprint: string;
    planned: number;
    completed: number;
  }>;
}

export function VelocityChart({ data }: VelocityChartProps) {
  return (
    <Card className="rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 bg-white dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white">
          <TrendingUp className="h-6 w-6 text-cardColor-600" />
          Team Velocity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
            <XAxis
              dataKey="sprint"
              stroke="#94a3b8"
              tick={{ fontSize: 14 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 14 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                fontSize: "0.875rem", // ← besar tooltip
                color: "#111827",
              }}
              labelStyle={{ fontSize: "0.875rem" }}
              itemStyle={{ fontSize: "0.875rem" }}
            />
            <Line
              type="monotone"
              dataKey="planned"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="6 4"
              name="Planned"
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Completed"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
