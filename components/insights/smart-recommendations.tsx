"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Heart,
  Zap,
  Calendar,
  X,
} from "lucide-react"
import type { Habit } from "@/components/habits/habit-tracker"
import type { MoodEntry } from "@/components/mood/mood-tracker"
import type { QuizAnswers } from "@/components/onboarding/lifestyle-quiz"

export interface Recommendation {
  id: string
  type: "habit" | "mood" | "general" | "streak" | "goal"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  action?: string
  icon: string
  dismissed?: boolean
  createdAt: string
}

const iconMap = {
  brain: Brain,
  lightbulb: Lightbulb,
  "trending-up": TrendingUp,
  "alert-circle": AlertCircle,
  "check-circle": CheckCircle,
  clock: Clock,
  target: Target,
  heart: Heart,
  zap: Zap,
  calendar: Calendar,
}

export function SmartRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [userData, setUserData] = useState<QuizAnswers | null>(null)
  const [dismissedRecommendations, setDismissedRecommendations] = useState<string[]>([])

  // Load data from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem("smartsync-habits")
    const savedMoods = localStorage.getItem("smartsync-moods")
    const savedUserData = localStorage.getItem("smartsync-user-data")
    const savedDismissed = localStorage.getItem("smartsync-dismissed-recommendations")

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }

    if (savedMoods) {
      setMoodEntries(JSON.parse(savedMoods))
    }

    if (savedUserData) {
      setUserData(JSON.parse(savedUserData))
    }

    if (savedDismissed) {
      setDismissedRecommendations(JSON.parse(savedDismissed))
    }
  }, [])

  // Generate recommendations based on user data
  useEffect(() => {
    if (!userData) return

    const newRecommendations: Recommendation[] = []

    // Analyze habit patterns
    const habitRecommendations = analyzeHabits()
    newRecommendations.push(...habitRecommendations)

    // Analyze mood patterns
    const moodRecommendations = analyzeMood()
    newRecommendations.push(...moodRecommendations)

    // General wellness recommendations
    const generalRecommendations = generateGeneralRecommendations()
    newRecommendations.push(...generalRecommendations)

    // Filter out dismissed recommendations
    const filteredRecommendations = newRecommendations.filter((rec) => !dismissedRecommendations.includes(rec.id))

    // Sort by priority
    const sortedRecommendations = filteredRecommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    setRecommendations(sortedRecommendations.slice(0, 6)) // Show top 6 recommendations
  }, [habits, moodEntries, userData, dismissedRecommendations])

  const analyzeHabits = (): Recommendation[] => {
    const recommendations: Recommendation[] = []

    // Check for incomplete habits
    const incompleteHabits = habits.filter((h) => !h.completedToday)
    if (incompleteHabits.length > 0) {
      recommendations.push({
        id: "incomplete-habits",
        type: "habit",
        priority: "high",
        title: "Complete Your Daily Habits",
        description: `You have ${incompleteHabits.length} habits left to complete today. Stay consistent!`,
        action: "View Habits",
        icon: "target",
        createdAt: new Date().toISOString(),
      })
    }

    // Check for declining streaks
    const decliningHabits = habits.filter((h) => h.streak > 0 && !h.completedToday)
    if (decliningHabits.length > 0) {
      const maxStreak = Math.max(...decliningHabits.map((h) => h.streak))
      recommendations.push({
        id: "streak-risk",
        type: "streak",
        priority: "high",
        title: "Don't Break Your Streak!",
        description: `Your ${maxStreak}-day streak is at risk. Complete your habits to maintain momentum.`,
        action: "Complete Now",
        icon: "alert-circle",
        createdAt: new Date().toISOString(),
      })
    }

    // Suggest new habits based on goals
    if (userData && habits.length < 5) {
      const missingHabits = suggestHabitsForGoals(userData.goals)
      if (missingHabits.length > 0) {
        recommendations.push({
          id: "suggest-new-habit",
          type: "habit",
          priority: "medium",
          title: "Add a New Habit",
          description: `Based on your goals, consider adding: ${missingHabits[0]}`,
          action: "Add Habit",
          icon: "lightbulb",
          createdAt: new Date().toISOString(),
        })
      }
    }

    // Celebrate achievements
    const completedToday = habits.filter((h) => h.completedToday).length
    if (completedToday === habits.length && habits.length > 0) {
      recommendations.push({
        id: "all-habits-complete",
        type: "habit",
        priority: "low",
        title: "Amazing Work!",
        description: "You've completed all your habits today. You're building great momentum!",
        icon: "check-circle",
        createdAt: new Date().toISOString(),
      })
    }

    return recommendations
  }

  const analyzeMood = (): Recommendation[] => {
    const recommendations: Recommendation[] = []

    // Check if mood hasn't been logged today
    const today = new Date().toDateString()
    const todaysMood = moodEntries.find((entry) => entry.date === today)

    if (!todaysMood) {
      recommendations.push({
        id: "log-mood",
        type: "mood",
        priority: "medium",
        title: "Check In With Yourself",
        description: "Take a moment to log your mood and reflect on your day.",
        action: "Log Mood",
        icon: "heart",
        createdAt: new Date().toISOString(),
      })
    }

    // Analyze recent mood trends
    const recentMoods = moodEntries.slice(0, 7) // Last 7 entries
    if (recentMoods.length >= 3) {
      const averageMood = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length

      if (averageMood < 3) {
        recommendations.push({
          id: "low-mood-support",
          type: "mood",
          priority: "high",
          title: "Take Care of Yourself",
          description: "Your mood has been lower lately. Consider self-care activities or talking to someone.",
          action: "Self-Care Tips",
          icon: "heart",
          createdAt: new Date().toISOString(),
        })
      } else if (averageMood >= 4) {
        recommendations.push({
          id: "positive-mood",
          type: "mood",
          priority: "low",
          title: "You're Doing Great!",
          description: "Your mood has been consistently positive. Keep up the great work!",
          icon: "zap",
          createdAt: new Date().toISOString(),
        })
      }
    }

    return recommendations
  }

  const generateGeneralRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = []

    // Time-based recommendations
    const currentHour = new Date().getHours()

    if (currentHour >= 6 && currentHour <= 10) {
      recommendations.push({
        id: "morning-routine",
        type: "general",
        priority: "medium",
        title: "Start Your Day Right",
        description: "Morning is a great time to complete your wellness habits and set intentions.",
        icon: "clock",
        createdAt: new Date().toISOString(),
      })
    } else if (currentHour >= 18 && currentHour <= 22) {
      recommendations.push({
        id: "evening-reflection",
        type: "general",
        priority: "medium",
        title: "Evening Reflection",
        description: "Take time to reflect on your day and prepare for tomorrow.",
        icon: "brain",
        createdAt: new Date().toISOString(),
      })
    }

    // Goal-based recommendations
    if (userData) {
      if (userData.goals.includes("Better sleep") && currentHour >= 22) {
        recommendations.push({
          id: "sleep-reminder",
          type: "general",
          priority: "high",
          title: "Wind Down for Better Sleep",
          description: "It's getting late. Consider starting your bedtime routine for better sleep quality.",
          icon: "clock",
          createdAt: new Date().toISOString(),
        })
      }

      if (userData.goals.includes("Reduce stress")) {
        recommendations.push({
          id: "stress-management",
          type: "general",
          priority: "medium",
          title: "Manage Your Stress",
          description: "Try a 5-minute breathing exercise or meditation to reduce stress levels.",
          action: "Quick Meditation",
          icon: "brain",
          createdAt: new Date().toISOString(),
        })
      }
    }

    return recommendations
  }

  const suggestHabitsForGoals = (goals: string[]): string[] => {
    const suggestions: string[] = []

    const habitSuggestions: Record<string, string[]> = {
      "Improve fitness": ["30-minute walk", "Strength training", "Yoga session"],
      "Better sleep": ["No screens 1 hour before bed", "Read before sleep", "Consistent bedtime"],
      "Reduce stress": ["Daily meditation", "Deep breathing exercises", "Journaling"],
      "Lose weight": ["Track calories", "Drink more water", "Healthy meal prep"],
      "Build muscle": ["Protein intake tracking", "Weight lifting", "Post-workout nutrition"],
      "Increase energy": ["Morning sunlight", "Regular meals", "Limit caffeine after 2pm"],
      "Better nutrition": ["Eat 5 servings of vegetables", "Cook at home", "Limit processed foods"],
      "Mental wellness": ["Gratitude journaling", "Mindfulness practice", "Social connection"],
    }

    goals.forEach((goal) => {
      if (habitSuggestions[goal]) {
        suggestions.push(...habitSuggestions[goal])
      }
    })

    // Filter out habits that already exist
    const existingHabitNames = habits.map((h) => h.name.toLowerCase())
    return suggestions.filter(
      (suggestion) => !existingHabitNames.some((name) => name.includes(suggestion.toLowerCase())),
    )
  }

  const dismissRecommendation = (recommendationId: string) => {
    const updatedDismissed = [...dismissedRecommendations, recommendationId]
    setDismissedRecommendations(updatedDismissed)
    localStorage.setItem("smartsync-dismissed-recommendations", JSON.stringify(updatedDismissed))

    setRecommendations((prev) => prev.filter((rec) => rec.id !== recommendationId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/20 dark:border-red-800/50"
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/20 dark:border-orange-800/50"
      case "low":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/20 dark:border-green-800/50"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/20 dark:border-blue-800/50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Smart Insights
        </h2>
        <p className="text-muted-foreground">Personalized recommendations based on your patterns and goals</p>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((recommendation) => {
            const IconComponent = iconMap[recommendation.icon as keyof typeof iconMap] || Lightbulb
            const priorityStyles = getPriorityColor(recommendation.priority)

            return (
              <Card key={recommendation.id} className={`transition-all duration-300 hover:shadow-md ${priorityStyles}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-current/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-base">{recommendation.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {recommendation.priority} Priority
                            </Badge>
                            <Badge variant="secondary" className="text-xs capitalize">
                              {recommendation.type}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissRecommendation(recommendation.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm mb-3">{recommendation.description}</p>
                      {recommendation.action && (
                        <Button size="sm" variant="outline" className="text-xs bg-transparent">
                          {recommendation.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="bg-card/50 border-dashed border-2">
          <CardContent className="p-8 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Recommendations Right Now</h3>
            <p className="text-muted-foreground">
              Keep using SmartSync to track your habits and mood. We'll provide personalized insights as we learn your
              patterns!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Insights Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your Progress Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{habits.filter((h) => h.completedToday).length}</div>
              <p className="text-sm text-muted-foreground">Habits completed today</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0}
              </div>
              <p className="text-sm text-muted-foreground">Best current streak</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-foreground">{moodEntries.length}</div>
              <p className="text-sm text-muted-foreground">Total mood check-ins</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-blue-200/50 dark:from-blue-950/20 dark:to-purple-950/20 dark:border-blue-800/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            Daily Wellness Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">
                <strong>Consistency beats perfection:</strong> It's better to do a small habit every day than a big one
                occasionally.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">
                <strong>Track your mood patterns:</strong> Understanding your emotional patterns can help you make
                better decisions.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm">
                <strong>Celebrate small wins:</strong> Acknowledge your progress, no matter how small it might seem.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
