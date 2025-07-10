"use client"

import { Badge } from "@/components/ui/badge"
import type { ProjectDifficulty } from "@/lib/types/api"

interface ProjectDifficultyBadgeProps {
  difficulty: ProjectDifficulty
  className?: string
}

export function ProjectDifficultyBadge({ difficulty, className }: ProjectDifficultyBadgeProps) {
  const getDifficultyConfig = (difficulty: ProjectDifficulty) => {
    switch (difficulty) {
      case "Easy":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: "🟢",
        }
      case "Medium":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: "🟡",
        }
      case "Hard":
        return {
          color: "bg-orange-100 text-orange-800 border-orange-200",
          icon: "🟠",
        }
      case "Extreme":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: "🔴",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "⚪",
        }
    }
  }

  const config = getDifficultyConfig(difficulty)

  return (
    <Badge variant="outline" className={`${config.color} ${className}`}>
      <span className="mr-1">{config.icon}</span>
      {difficulty}
    </Badge>
  )
}
