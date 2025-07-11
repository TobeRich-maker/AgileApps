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
import { BarChart3 } from "lucide-react";

interface BurndownChartProps {
  data: Array<{
    day: string;
    ideal: number;
    actual: number;
  }>;
}

export function BurndownChart({ data }: BurndownChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-600" />
          Sprint Burndown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="ideal"
              stroke="#94a3b8"
              strokeDasharray="5 5"
              name="Ideal"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#dc2626"
              strokeWidth={2}
              name="Actual"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
