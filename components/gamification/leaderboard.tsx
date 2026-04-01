"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Flame } from "lucide-react"

export interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  level: number
  streak: number
  badge: "Gold" | "Silver" | "Bronze" | "Platinum" | "Diamond"
}

interface LeaderboardProps {
  entries?: LeaderboardEntry[]
}

export function Leaderboard({ entries = [] }: LeaderboardProps) {
  const defaultEntries: LeaderboardEntry[] = [
    {
      rank: 1,
      name: "You",
      points: 2450,
      level: 5,
      streak: 12,
      badge: "Gold",
    },
    {
      rank: 2,
      name: "wellness_champion",
      points: 2300,
      level: 5,
      streak: 10,
      badge: "Gold",
    },
    {
      rank: 3,
      name: "fitness_master",
      points: 2100,
      level: 4,
      streak: 8,
      badge: "Silver",
    },
    {
      rank: 4,
      name: "health_seeker",
      points: 1950,
      level: 4,
      streak: 7,
      badge: "Silver",
    },
    {
      rank: 5,
      name: "balanced_life",
      points: 1750,
      level: 4,
      streak: 6,
      badge: "Bronze",
    },
  ]

  const displayEntries = entries.length > 0 ? entries : defaultEntries

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-orange-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Diamond":
        return "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30"
      case "Platinum":
        return "bg-gray-400/20 text-gray-700 dark:text-gray-300 border-gray-400/30"
      case "Gold":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30"
      case "Silver":
        return "bg-gray-300/20 text-gray-700 dark:text-gray-300 border-gray-300/30"
      default:
        return "bg-orange-600/20 text-orange-700 dark:text-orange-300 border-orange-600/30"
    }
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
          <Trophy className="h-5 w-5" />
          Global Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {displayEntries.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              entry.rank === 1
                ? "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-200 dark:border-yellow-800/50"
                : "bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700/50"
            }`}>
            <div className="flex items-center gap-3 flex-1">
              {getMedalIcon(entry.rank)}
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate text-slate-900 dark:text-white">{entry.name}</p>
                <div className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{entry.streak} day streak</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <Badge className={`${getBadgeColor(entry.badge)} border`}>{entry.badge}</Badge>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">{entry.points} pts</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
