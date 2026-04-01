"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, Trophy, Star, Zap, Target, Heart, Calendar, TrendingUp } from "lucide-react"
import type { Habit } from "@/components/habits/habit-tracker"
import type { MoodEntry } from "@/components/mood/mood-tracker"

export interface UserBadge {
  id: string
  name: string
  description: string
  icon: string
  category: string
  earned: boolean
  earnedDate?: string
  progress?: number
  maxProgress?: number
}

const badgeDefinitions: Omit<UserBadge, "earned" | "earnedDate" | "progress">[] = [
  // Habit Badges
  {
    id: "first-habit",
    name: "Getting Started",
    description: "Complete your first habit",
    icon: "target",
    category: "Habits",
    maxProgress: 1,
  },
  {
    id: "habit-streak-7",
    name: "Week Warrior",
    description: "Maintain a 7-day habit streak",
    icon: "calendar",
    category: "Streaks",
    maxProgress: 7,
  },
  {
    id: "habit-streak-30",
    name: "Monthly Master",
    description: "Maintain a 30-day habit streak",
    icon: "trophy",
    category: "Streaks",
    maxProgress: 30,
  },
  {
    id: "perfect-day",
    name: "Perfect Day",
    description: "Complete all habits in a single day",
    icon: "star",
    category: "Habits",
    maxProgress: 1,
  },
  {
    id: "habit-collector",
    name: "Habit Collector",
    description: "Create 5 different habits",
    icon: "award",
    category: "Habits",
    maxProgress: 5,
  },
  // Mood Badges
  {
    id: "mood-tracker",
    name: "Mood Tracker",
    description: "Log your first mood entry",
    icon: "heart",
    category: "Mood",
    maxProgress: 1,
  },
  {
    id: "mood-streak-7",
    name: "Emotional Awareness",
    description: "Log mood for 7 consecutive days",
    icon: "trending-up",
    category: "Mood",
    maxProgress: 7,
  },
  {
    id: "positive-week",
    name: "Positive Vibes",
    description: "Maintain happy mood for a week",
    icon: "zap",
    category: "Mood",
    maxProgress: 7,
  },
  // Milestone Badges
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Use SmartSync for 7 days",
    icon: "star",
    category: "Milestones",
    maxProgress: 7,
  },
  {
    id: "dedicated-user",
    name: "Dedicated User",
    description: "Use SmartSync for 30 days",
    icon: "trophy",
    category: "Milestones",
    maxProgress: 30,
  },
]

const iconMap = {
  target: Target,
  calendar: Calendar,
  trophy: Trophy,
  star: Star,
  award: Award,
  heart: Heart,
  "trending-up": TrendingUp,
  zap: Zap,
}

export function BadgeSystem() {
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])

  // Load data from localStorage
  useEffect(() => {
    const savedBadges = localStorage.getItem("smartsync-badges")
    const savedHabits = localStorage.getItem("smartsync-habits")
    const savedMoods = localStorage.getItem("smartsync-moods")

    if (savedBadges) {
      setUserBadges(JSON.parse(savedBadges))
    } else {
      // Initialize badges
      const initialBadges = badgeDefinitions.map((badge) => ({
        ...badge,
        earned: false,
        progress: 0,
      }))
      setUserBadges(initialBadges)
    }

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }

    if (savedMoods) {
      setMoodEntries(JSON.parse(savedMoods))
    }
  }, [])

  // Check and update badges based on user progress
  useEffect(() => {
    if (userBadges.length === 0) return

    const updatedBadges = [...userBadges]
    let hasChanges = false

    // Check habit-related badges
    const completedHabitsToday = habits.filter((h) => h.completedToday).length
    const totalHabits = habits.length
    const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0

    // First habit badge
    const firstHabitBadge = updatedBadges.find((b) => b.id === "first-habit")
    if (firstHabitBadge && !firstHabitBadge.earned && habits.some((h) => h.completedToday)) {
      firstHabitBadge.earned = true
      firstHabitBadge.earnedDate = new Date().toISOString()
      firstHabitBadge.progress = 1
      hasChanges = true
    }

    // Perfect day badge
    const perfectDayBadge = updatedBadges.find((b) => b.id === "perfect-day")
    if (perfectDayBadge && !perfectDayBadge.earned && totalHabits > 0 && completedHabitsToday === totalHabits) {
      perfectDayBadge.earned = true
      perfectDayBadge.earnedDate = new Date().toISOString()
      perfectDayBadge.progress = 1
      hasChanges = true
    }

    // Habit collector badge
    const habitCollectorBadge = updatedBadges.find((b) => b.id === "habit-collector")
    if (habitCollectorBadge) {
      habitCollectorBadge.progress = Math.min(totalHabits, 5)
      if (!habitCollectorBadge.earned && totalHabits >= 5) {
        habitCollectorBadge.earned = true
        habitCollectorBadge.earnedDate = new Date().toISOString()
        hasChanges = true
      }
    }

    // Streak badges
    const weekStreakBadge = updatedBadges.find((b) => b.id === "habit-streak-7")
    if (weekStreakBadge) {
      weekStreakBadge.progress = Math.min(maxStreak, 7)
      if (!weekStreakBadge.earned && maxStreak >= 7) {
        weekStreakBadge.earned = true
        weekStreakBadge.earnedDate = new Date().toISOString()
        hasChanges = true
      }
    }

    const monthStreakBadge = updatedBadges.find((b) => b.id === "habit-streak-30")
    if (monthStreakBadge) {
      monthStreakBadge.progress = Math.min(maxStreak, 30)
      if (!monthStreakBadge.earned && maxStreak >= 30) {
        monthStreakBadge.earned = true
        monthStreakBadge.earnedDate = new Date().toISOString()
        hasChanges = true
      }
    }

    // Check mood-related badges
    const moodStreak = getMoodStreak()
    const recentPositiveMoods = getRecentPositiveMoods()

    // First mood badge
    const moodTrackerBadge = updatedBadges.find((b) => b.id === "mood-tracker")
    if (moodTrackerBadge && !moodTrackerBadge.earned && moodEntries.length > 0) {
      moodTrackerBadge.earned = true
      moodTrackerBadge.earnedDate = new Date().toISOString()
      moodTrackerBadge.progress = 1
      hasChanges = true
    }

    // Mood streak badge
    const moodStreakBadge = updatedBadges.find((b) => b.id === "mood-streak-7")
    if (moodStreakBadge) {
      moodStreakBadge.progress = Math.min(moodStreak, 7)
      if (!moodStreakBadge.earned && moodStreak >= 7) {
        moodStreakBadge.earned = true
        moodStreakBadge.earnedDate = new Date().toISOString()
        hasChanges = true
      }
    }

    // Positive week badge
    const positiveWeekBadge = updatedBadges.find((b) => b.id === "positive-week")
    if (positiveWeekBadge) {
      positiveWeekBadge.progress = Math.min(recentPositiveMoods, 7)
      if (!positiveWeekBadge.earned && recentPositiveMoods >= 7) {
        positiveWeekBadge.earned = true
        positiveWeekBadge.earnedDate = new Date().toISOString()
        hasChanges = true
      }
    }

    // Check milestone badges
    const appUsageDays = getAppUsageDays()

    const earlyBirdBadge = updatedBadges.find((b) => b.id === "early-bird")
    if (earlyBirdBadge) {
      earlyBirdBadge.progress = Math.min(appUsageDays, 7)
      if (!earlyBirdBadge.earned && appUsageDays >= 7) {
        earlyBirdBadge.earned = true
        earlyBirdBadge.earnedDate = new Date().toISOString()
        hasChanges = true
      }
    }

    const dedicatedUserBadge = updatedBadges.find((b) => b.id === "dedicated-user")
    if (dedicatedUserBadge) {
      dedicatedUserBadge.progress = Math.min(appUsageDays, 30)
      if (!dedicatedUserBadge.earned && appUsageDays >= 30) {
        dedicatedUserBadge.earned = true
        dedicatedUserBadge.earnedDate = new Date().toISOString()
        hasChanges = true
      }
    }

    if (hasChanges) {
      setUserBadges(updatedBadges)
      localStorage.setItem("smartsync-badges", JSON.stringify(updatedBadges))
    }
  }, [habits, moodEntries, userBadges])

  const getMoodStreak = () => {
    if (moodEntries.length === 0) return 0

    let streak = 0
    const sortedEntries = [...moodEntries].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].timestamp)
      const expectedDate = new Date()
      expectedDate.setDate(expectedDate.getDate() - i)

      if (entryDate.toDateString() === expectedDate.toDateString()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const getRecentPositiveMoods = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    return moodEntries.filter((entry) => new Date(entry.timestamp) >= oneWeekAgo && entry.mood >= 4).length
  }

  const getAppUsageDays = () => {
    // Calculate based on earliest habit or mood entry
    const allDates = [...habits.map((h) => new Date(h.createdAt)), ...moodEntries.map((m) => new Date(m.timestamp))]

    if (allDates.length === 0) return 0

    const earliestDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - earliestDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const earnedBadges = userBadges.filter((badge) => badge.earned)
  const inProgressBadges = userBadges.filter((badge) => !badge.earned && (badge.progress || 0) > 0)
  const availableBadges = userBadges.filter((badge) => !badge.earned && (badge.progress || 0) === 0)

  const categories = ["Habits", "Mood", "Streaks", "Milestones"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Achievement Center</h2>
        <p className="text-muted-foreground">
          You've earned {earnedBadges.length} out of {userBadges.length} badges
        </p>
        <div className="mt-4">
          <Progress value={(earnedBadges.length / userBadges.length) * 100} className="h-3" />
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => {
              const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Award
              return (
                <Card
                  key={badge.id}
                  className="bg-gradient-to-br from-yellow-50/50 to-orange-50/50 border-yellow-200 dark:from-yellow-950/20 dark:to-orange-950/20 dark:border-yellow-800/50 hover:scale-105 transition-transform duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{badge.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                            {badge.category}
                          </Badge>
                          {badge.earnedDate && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(badge.earnedDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* In Progress Badges */}
      {inProgressBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            In Progress ({inProgressBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressBadges.map((badge) => {
              const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Award
              const progressPercentage = badge.maxProgress ? ((badge.progress || 0) / badge.maxProgress) * 100 : 0
              return (
                <Card
                  key={badge.id}
                  className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-blue-200 dark:from-blue-950/20 dark:to-purple-950/20 dark:border-blue-800/50 hover:scale-105 transition-transform duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{badge.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <Badge variant="outline" className="text-xs">
                              {badge.category}
                            </Badge>
                            <span className="text-muted-foreground">
                              {badge.progress}/{badge.maxProgress}
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Available Badges */}
      {availableBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-gray-500" />
            Available Badges ({availableBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableBadges.map((badge) => {
              const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Award
              return (
                <Card
                  key={badge.id}
                  className="bg-card/50 border-dashed border-2 hover:bg-card/70 transition-colors duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-muted-foreground">{badge.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {badge.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Badge Categories Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Badge Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const categoryBadges = userBadges.filter((badge) => badge.category === category)
              const earnedInCategory = categoryBadges.filter((badge) => badge.earned).length
              return (
                <div key={category} className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {earnedInCategory}/{categoryBadges.length}
                  </div>
                  <p className="text-sm text-muted-foreground">{category}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
