"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface VelocityChartProps {
  data: Array<{
    sprint: string
    planned: number
    completed: number
  }>
}

export function VelocityChart({ data }: VelocityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Team Velocity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sprint" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="planned" stroke="#94a3b8" strokeDasharray="5 5" name="Planned" />
            <Line type="monotone" dataKey="completed" stroke="#16a34a" strokeWidth={2} name="Completed" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
