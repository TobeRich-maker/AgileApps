"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ColorPaletteDemo() {
  const colors = [
    { name: "Cream", hex: "#FEFAE0", class: "bg-secondary-100" },
    { name: "Dark Forest Green", hex: "#0A400C", class: "bg-accent-800" },
    { name: "Sage Green", hex: "#819067", class: "bg-primary-500" },
    { name: "Light Sage", hex: "#B1AB86", class: "bg-secondary-800" },
  ];

  return (
    <div className="p-8 bg-app-bg min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-app-primary mb-8 text-center">
          SprintFlow Color Palette
        </h1>

        {/* Color Swatches */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {colors.map((color) => (
            <Card key={color.name} className="text-center">
              <CardContent className="p-6">
                <div
                  className={`w-20 h-20 ${color.class} rounded-lg mx-auto mb-4 shadow-md`}
                />
                <h3 className="font-semibold text-app-primary">{color.name}</h3>
                <p className="text-sm text-app-muted font-mono">{color.hex}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Component Examples */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="sage">Sage</Button>
                <Button variant="cream">Cream</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="sage">Sage</Badge>
                <Badge variant="cream">Cream</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge status="todo">To Do</Badge>
                <Badge status="in-progress">In Progress</Badge>
                <Badge status="done">Done</Badge>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge priority="low">Low Priority</Badge>
                <Badge priority="medium">Medium Priority</Badge>
                <Badge priority="high">High Priority</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sample Dashboard Preview */}
        <Card className="mt-8">
          <CardHeader className="bg-header-bg text-white">
            <CardTitle className="text-white">Dashboard Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <h3 className="font-semibold text-primary-700 mb-2">
                  Active Tasks
                </h3>
                <p className="text-2xl font-bold text-primary-600">24</p>
              </div>
              <div className="bg-accent-50 p-4 rounded-lg border border-accent-200">
                <h3 className="font-semibold text-accent-700 mb-2">
                  Completed
                </h3>
                <p className="text-2xl font-bold text-accent-600">18</p>
              </div>
              <div className="bg-secondary-50 p-4 rounded-lg border border-secondary-200">
                <h3 className="font-semibold text-secondary-700 mb-2">
                  In Review
                </h3>
                <p className="text-2xl font-bold text-secondary-600">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
