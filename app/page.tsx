"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Target, TrendingUp, Award, Palette, Heart, Brain } from "lucide-react"
import { ColorPicker } from "@/components/color-picker"
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"
import { PlayerStatsCard } from "@/components/gamification/points-system"
import { Leaderboard } from "@/components/gamification/leaderboard"
import type { QuizAnswers } from "@/components/onboarding/lifestyle-quiz"
import type { Habit } from "@/components/habits/habit-tracker"
import type { MoodEntry } from "@/components/mood/mood-tracker"
import type { UserBadge } from "@/components/gamification/badge-system"
import Link from "next/link"

export default function SmartSyncDashboard() {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [userData, setUserData] = useState<QuizAnswers | null>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load saved data from localStorage
  useEffect(() => {
    const savedColor = localStorage.getItem("smartsync-bg-color")
    const onboardingComplete = localStorage.getItem("smartsync-onboarding-complete")
    const savedUserData = localStorage.getItem("smartsync-user-data")
    const savedHabits = localStorage.getItem("smartsync-habits")
    const savedMoods = localStorage.getItem("smartsync-moods")
    const savedBadges = localStorage.getItem("smartsync-badges")

    if (savedColor) {
      setBackgroundColor(savedColor)
      document.body.style.backgroundColor = savedColor
    }

    if (onboardingComplete === "true" && savedUserData) {
      setIsOnboardingComplete(true)
      setUserData(JSON.parse(savedUserData))
    }

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }

    if (savedMoods) {
      setMoodEntries(JSON.parse(savedMoods))
    }

    if (savedBadges) {
      setBadges(JSON.parse(savedBadges))
    }

    setIsLoading(false)
  }, [])

  // Update background color
  const handleColorChange = (color: string) => {
    setBackgroundColor(color)
    document.body.style.backgroundColor = color
    localStorage.setItem("smartsync-bg-color", color)
  }

  const handleOnboardingComplete = (answers: QuizAnswers) => {
    setUserData(answers)
    setIsOnboardingComplete(true)
  }

  const resetOnboarding = () => {
    localStorage.removeItem("smartsync-onboarding-complete")
    localStorage.removeItem("smartsync-user-data")
    setIsOnboardingComplete(false)
    setUserData(null)
  }

  const getHabitStats = () => {
    const completedToday = habits.filter((h) => h.completedToday).length
    const totalHabits = habits.length
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0
    const longestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0

    return { completedToday, totalHabits, completionRate, longestStreak }
  }

  const getTodaysMood = () => {
    const today = new Date().toDateString()
    return moodEntries.find((entry) => entry.date === today)
  }

  const getEarnedBadges = () => {
    return badges.filter((badge) => badge.earned)
  }

  const getSmartRecommendation = () => {
    const incompleteHabits = habits.filter((h) => !h.completedToday)
    const today = new Date().toDateString()
    const todaysMood = moodEntries.find((entry) => entry.date === today)

    if (incompleteHabits.length > 0) {
      return {
        title: "Complete Your Daily Habits",
        description: `You have ${incompleteHabits.length} habits left to complete today.`,
        priority: "high",
      }
    }

    if (!todaysMood) {
      return {
        title: "Check In With Yourself",
        description: "Take a moment to log your mood and reflect on your day.",
        priority: "medium",
      }
    }

    return {
      title: "You're Doing Great!",
      description: "Keep up the excellent work with your wellness journey.",
      priority: "low",
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isOnboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  const { completedToday, totalHabits, completionRate, longestStreak } = getHabitStats()
  const todaysMood = getTodaysMood()
  const earnedBadges = getEarnedBadges()
  const smartRecommendation = getSmartRecommendation()

  return (
    <div className="min-h-screen p-4 transition-all duration-500 animate-in fade-in">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 animate-in slide-in-from-top duration-700 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-xl border border-green-200/50 dark:border-green-800/30">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            SmartSync
          </h1>
          <p className="text-emerald-700 dark:text-emerald-300 font-medium">Your Personal Wellness Coach</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="relative transition-all duration-200 hover:scale-110 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800/50 hover:shadow-lg"
          >
            <Palette className="h-4 w-4 text-green-600 dark:text-green-400" />
          </Button>
          <Link href="/settings">
            <Button
              variant="outline"
              size="icon"
              className="transition-all duration-200 hover:scale-110 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800/50 hover:shadow-lg"
            >
              <Settings className="h-4 w-4 text-green-600 dark:text-green-400" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Color Picker */}
      {showColorPicker && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
          <ColorPicker color={backgroundColor} onChange={handleColorChange} onClose={() => setShowColorPicker(false)} />
        </div>
      )}

      {/* Welcome Section */}
      <div className="mb-8 animate-in slide-in-from-left duration-700 delay-100">
        <Card className="bg-gradient-to-br from-green-50/70 to-emerald-50/70 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800/50 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-green-700 dark:text-green-300">
              Good morning!
              <span className="animate-bounce">👋</span>
              {todaysMood && <span className="text-2xl ml-2">{todaysMood.emoji}</span>}
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              {todaysMood ? (
                <>
                  Feeling {todaysMood.label.toLowerCase()} today! You have {totalHabits - completedToday} habits left to
                  complete.
                </>
              ) : (
                <>Ready to make today count? You have {totalHabits - completedToday} habits left to complete.</>
              )}
              {userData && (
                <span className="block mt-1 text-green-700 dark:text-green-300 font-semibold">
                  Focus: {userData.goals.slice(0, 2).join(", ")}
                </span>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Smart Recommendation Preview */}
      <div className="mb-8 animate-in slide-in-from-right duration-700 delay-150">
        <Card
          className={`transition-all duration-300 hover:shadow-md ${
            smartRecommendation.priority === "high"
              ? "bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-800/50"
              : smartRecommendation.priority === "medium"
                ? "bg-orange-50/50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800/50"
                : "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-800/50"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-semibold text-sm">{smartRecommendation.title}</h4>
                  <p className="text-xs text-muted-foreground">{smartRecommendation.description}</p>
                </div>
              </div>
              <Link href="/insights">
                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                  View All Insights
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player Stats */}
      <div className="mb-8 animate-in slide-in-from-bottom duration-700 delay-200">
        <PlayerStatsCard />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-orange-50/50 to-red-50/50 border-orange-200 dark:from-orange-950/20 dark:to-red-950/20 dark:border-orange-800/50 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom duration-700 delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{longestStreak} days</div>
            <p className="text-xs text-muted-foreground">Your best streak</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800/50 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom duration-700 delay-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habits Completed</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedToday}/{totalHabits}
            </div>
            <p className="text-xs text-muted-foreground">{completionRate}% completion rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50/50 to-teal-50/50 border-blue-200 dark:from-blue-950/20 dark:to-teal-950/20 dark:border-blue-800/50 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom duration-700 delay-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{earnedBadges.length}</div>
            <p className="text-xs text-muted-foreground">Achievements unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <div className="mb-8 animate-in slide-in-from-bottom duration-700 delay-600">
        <Leaderboard />
      </div>

      {/* Recent Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-8 animate-in slide-in-from-right duration-700 delay-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Recent Achievements
            </h2>
            <Link href="/badges">
              <Button size="sm" variant="outline" className="gap-2 hover:scale-105 transition-transform bg-transparent">
                <Award className="h-4 w-4" />
                View All
              </Button>
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {earnedBadges.slice(0, 4).map((badge) => (
              <Card
                key={badge.id}
                className="flex-shrink-0 w-48 bg-gradient-to-br from-amber-50/70 to-yellow-50/70 border-amber-200 dark:from-amber-950/30 dark:to-yellow-950/30 dark:border-amber-800/60 hover:scale-105 hover:shadow-lg transition-all duration-200"
              >
                <CardContent className="p-3">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1 text-amber-900 dark:text-amber-100">{badge.name}</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-300">{badge.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Today's Habits Preview */}
      <div className="mb-8 animate-in slide-in-from-right duration-700 delay-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Today's Habits
          </h2>
          <Link href="/habits">
            <Button size="sm" className="gap-2 hover:scale-105 transition-transform bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg">
              <Target className="h-4 w-4" />
              View All
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {habits.slice(0, 3).map((habit) => (
            <Card
              key={habit.id}
              className="bg-gradient-to-r from-white/50 to-green-50/50 dark:from-slate-900/50 dark:to-green-950/50 border-green-200 dark:border-green-800/50 hover:shadow-lg transition-all duration-300 hover:translate-x-1"
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full animate-pulse ${
                      habit.completedToday
                        ? "bg-green-500 animate-none"
                        : habit.currentValue > 0
                          ? "bg-amber-500"
                          : "bg-slate-300"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{habit.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {habit.currentValue}/{habit.targetValue} {habit.unit}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`${
                    habit.completedToday
                      ? "bg-green-600 text-white"
                      : habit.currentValue > 0
                        ? "bg-amber-600 text-white"
                        : "bg-slate-300 text-slate-700"
                  }`}>
                  {habit.completedToday ? "Completed" : habit.currentValue > 0 ? "In Progress" : "Pending"}
                </Badge>
              </CardContent>
            </Card>
          ))}

          {habits.length === 0 && (
            <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800/50">
              <CardContent className="p-4 text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-2">No habits added yet</p>
                <Link href="/habits">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    Add Your First Habit
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 animate-in slide-in-from-left duration-700 delay-600">
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/habits">
            <Button
              className="h-20 flex-col gap-2 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 dark:from-green-950/40 dark:to-emerald-950/40 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/50 transition-all duration-300 hover:scale-105 w-full border"
            >
              <Target className="h-5 w-5" />
              <span className="text-sm font-medium">Manage Habits</span>
            </Button>
          </Link>
          <Link href="/mood">
            <Button
              className="h-20 flex-col gap-2 bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 dark:from-red-950/40 dark:to-pink-950/40 dark:hover:from-red-900/50 dark:hover:to-pink-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50 transition-all duration-300 hover:scale-105 w-full border"
            >
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">Mood Check</span>
            </Button>
          </Link>
          <Link href="/badges">
            <Button
              className="h-20 flex-col gap-2 bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 dark:from-amber-950/40 dark:to-yellow-950/40 dark:hover:from-amber-900/50 dark:hover:to-yellow-900/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50 transition-all duration-300 hover:scale-105 w-full border"
            >
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">View Badges</span>
            </Button>
          </Link>
          <Link href="/insights">
            <Button
              className="h-20 flex-col gap-2 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 dark:from-blue-950/40 dark:to-cyan-950/40 dark:hover:from-blue-900/50 dark:hover:to-cyan-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 transition-all duration-300 hover:scale-105 w-full border"
            >
              <Brain className="h-5 w-5" />
              <span className="text-sm font-medium">Smart Insights</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Personalization Tip */}
      <Card className="bg-gradient-to-r from-emerald-50/70 to-green-50/70 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800/50 animate-in slide-in-from-bottom duration-700 delay-700 hover:shadow-lg transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-semibold text-green-700 dark:text-green-300">Customize Your Experience</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Click the palette icon in the header to change your background color and make SmartSync truly yours!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug: Reset Onboarding */}
      <div className="mt-8 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={resetOnboarding}
          className="text-muted-foreground hover:text-foreground"
        >
          Reset Onboarding (Debug)
        </Button>
      </div>
    </div>
  )
}
