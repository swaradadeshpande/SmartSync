"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Zap, Flame, Award, TrendingUp } from "lucide-react"

export interface PlayerStats {
  totalPoints: number
  level: number
  currentLevelPoints: number
  nextLevelPoints: number
  streak: number
  multiplier: number
  rank: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond"
}

export function PointsSystem() {
  const [stats, setStats] = useState<PlayerStats>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("smartsync-player-stats")
      return saved
        ? JSON.parse(saved)
        : {
            totalPoints: 0,
            level: 1,
            currentLevelPoints: 0,
            nextLevelPoints: 100,
            streak: 0,
            multiplier: 1,
            rank: "Bronze",
          }
    }
    return {
      totalPoints: 0,
      level: 1,
      currentLevelPoints: 0,
      nextLevelPoints: 100,
      streak: 0,
      multiplier: 1,
      rank: "Bronze",
    }
  })

  const addPoints = (basePoints: number, reason: string) => {
    const earnedPoints = Math.round(basePoints * (stats.multiplier || 1))
    const newStats = { ...stats }
    newStats.totalPoints += earnedPoints
    newStats.currentLevelPoints += earnedPoints

    // Check for level up
    if (newStats.currentLevelPoints >= newStats.nextLevelPoints) {
      newStats.level += 1
      newStats.currentLevelPoints = 0
      newStats.nextLevelPoints = 100 + newStats.level * 50
      newStats.multiplier = 1 + (newStats.level - 1) * 0.1 // Increase multiplier with level
    }

    // Update rank based on total points
    if (newStats.totalPoints >= 10000) newStats.rank = "Diamond"
    else if (newStats.totalPoints >= 5000) newStats.rank = "Platinum"
    else if (newStats.totalPoints >= 2500) newStats.rank = "Gold"
    else if (newStats.totalPoints >= 1000) newStats.rank = "Silver"
    else newStats.rank = "Bronze"

    setStats(newStats)
    localStorage.setItem("smartsync-player-stats", JSON.stringify(newStats))
    return earnedPoints
  }

  const levelProgress = (stats.currentLevelPoints / stats.nextLevelPoints) * 100

  const getRankColor = () => {
    switch (stats.rank) {
      case "Diamond":
        return "from-cyan-400 to-blue-500"
      case "Platinum":
        return "from-gray-300 to-gray-400"
      case "Gold":
        return "from-yellow-400 to-orange-400"
      case "Silver":
        return "from-gray-200 to-gray-300"
      default:
        return "from-amber-600 to-amber-700"
    }
  }

  return {
    stats,
    addPoints,
    levelProgress,
    getRankColor,
  }
}

export function PlayerStatsCard() {
  const { stats, levelProgress, getRankColor } = PointsSystem()

  return (
    <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800/50 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Level {stats.level}
            </CardTitle>
          </div>
          <Badge className={`bg-gradient-to-r ${getRankColor()} text-white border-0`}>{stats.rank}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Points */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              Total Points
            </span>
            <span className="font-bold text-green-600">{stats.totalPoints.toLocaleString()}</span>
          </div>
          <Progress value={Math.min(levelProgress, 100)} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {stats.currentLevelPoints} / {stats.nextLevelPoints} to next level
          </p>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded-lg">
          <span className="text-sm font-medium flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            Streak
          </span>
          <span className="font-bold text-orange-600">{stats.streak} days</span>
        </div>

        {/* Multiplier */}
        <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-black/20 rounded-lg">
          <span className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Point Multiplier
          </span>
          <span className="font-bold text-green-600">{stats.multiplier.toFixed(1)}x</span>
        </div>
      </CardContent>
    </Card>
  )
}
