"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Check, X, Target, Droplets, Dumbbell, Brain, Apple, Moon, Book, Trash2, Sparkles, Zap, Star } from "lucide-react"

export interface Habit {
  id: string
  name: string
  description: string
  category: string
  icon: string
  targetValue: number
  currentValue: number
  unit: string
  streak: number
  completedToday: boolean
  createdAt: string
  lastCompleted?: string
}

const habitIcons = {
  water: Droplets,
  exercise: Dumbbell,
  meditation: Brain,
  nutrition: Apple,
  sleep: Moon,
  reading: Book,
  general: Target,
}

const habitCategories = [
  "Health & Fitness",
  "Mental Wellness",
  "Productivity",
  "Learning",
  "Nutrition",
  "Sleep",
  "Other",
]

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [completedHabits, setCompletedHabits] = useState<string[]>([])
  const [pointsEarned, setPointsEarned] = useState<{ habitId: string; points: number; show: boolean } | null>(null)
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "",
    icon: "general",
    targetValue: 1,
    unit: "times",
  })

  // Load habits from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem("smartsync-habits")
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits)
      // Check if it's a new day and reset daily progress
      const today = new Date().toDateString()
      const updatedHabits = parsedHabits.map((habit: Habit) => {
        const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null
        if (lastCompleted !== today) {
          return {
            ...habit,
            currentValue: 0,
            completedToday: false,
          }
        }
        return habit
      })
      setHabits(updatedHabits)
    } else {
      // Initialize with some default habits
      const defaultHabits: Habit[] = [
        {
          id: "1",
          name: "Drink Water",
          description: "Stay hydrated throughout the day",
          category: "Health & Fitness",
          icon: "water",
          targetValue: 8,
          currentValue: 6,
          unit: "glasses",
          streak: 7,
          completedToday: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Exercise",
          description: "Daily physical activity",
          category: "Health & Fitness",
          icon: "exercise",
          targetValue: 30,
          currentValue: 30,
          unit: "minutes",
          streak: 5,
          completedToday: true,
          createdAt: new Date().toISOString(),
          lastCompleted: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Meditation",
          description: "Mindfulness practice",
          category: "Mental Wellness",
          icon: "meditation",
          targetValue: 10,
          currentValue: 0,
          unit: "minutes",
          streak: 3,
          completedToday: false,
          createdAt: new Date().toISOString(),
        },
      ]
      setHabits(defaultHabits)
      localStorage.setItem("smartsync-habits", JSON.stringify(defaultHabits))
    }
  }, [])

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("smartsync-habits", JSON.stringify(habits))
    }
  }, [habits])

  const addHabit = () => {
    if (!newHabit.name.trim()) return

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      description: newHabit.description,
      category: newHabit.category,
      icon: newHabit.icon,
      targetValue: newHabit.targetValue,
      currentValue: 0,
      unit: newHabit.unit,
      streak: 0,
      completedToday: false,
      createdAt: new Date().toISOString(),
    }

    setHabits((prev) => [...prev, habit])
    setNewHabit({
      name: "",
      description: "",
      category: "",
      icon: "general",
      targetValue: 1,
      unit: "times",
    })
    setShowAddDialog(false)
  }

  const updateHabitProgress = (habitId: string, increment: number) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const newValue = Math.max(0, Math.min(habit.targetValue, habit.currentValue + increment))
          const wasCompleted = habit.completedToday
          const isNowCompleted = newValue >= habit.targetValue

          if (isNowCompleted && !wasCompleted) {
            setCompletedHabits((prev) => [...prev, habitId])
            setTimeout(() => {
              setCompletedHabits((prev) => prev.filter((id) => id !== habitId))
            }, 2000)
          }

          return {
            ...habit,
            currentValue: newValue,
            completedToday: isNowCompleted,
            streak: isNowCompleted && !wasCompleted ? habit.streak + 1 : habit.streak,
            lastCompleted: isNowCompleted ? new Date().toISOString() : habit.lastCompleted,
          }
        }
        return habit
      }),
    )
  }

  const deleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId))
  }

  const getCompletionRate = () => {
    if (habits.length === 0) return 0
    const completedHabits = habits.filter((habit) => habit.completedToday).length
    return Math.round((completedHabits / habits.length) * 100)
  }

  const IconComponent = (iconName: string) => {
    const Icon = habitIcons[iconName as keyof typeof habitIcons] || Target
    return Icon
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header with Stats */}
      <div className="flex items-center justify-between animate-in slide-in-from-top duration-700">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Habit Tracker
          </h2>
          <p className="text-muted-foreground">
            {habits.filter((h) => h.completedToday).length} of {habits.length} habits completed today
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 hover:scale-105 transition-all duration-200 bg-gradient-to-r from-primary to-secondary hover:shadow-lg">
              <Plus className="h-4 w-4" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Add New Habit
              </DialogTitle>
              <DialogDescription>Create a new habit to track daily</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="habit-name">Habit Name</Label>
                <Input
                  id="habit-name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Read for 30 minutes"
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>
              <div>
                <Label htmlFor="habit-description">Description (optional)</Label>
                <Input
                  id="habit-description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the habit"
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="habit-category">Category</Label>
                  <Select
                    value={newHabit.category}
                    onValueChange={(value) => setNewHabit((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {habitCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="habit-icon">Icon</Label>
                  <Select
                    value={newHabit.icon}
                    onValueChange={(value) => setNewHabit((prev) => ({ ...prev, icon: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(habitIcons).map(([key, Icon]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="habit-target">Target</Label>
                  <Input
                    id="habit-target"
                    type="number"
                    min="1"
                    value={newHabit.targetValue}
                    onChange={(e) =>
                      setNewHabit((prev) => ({ ...prev, targetValue: Number.parseInt(e.target.value) || 1 }))
                    }
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>
                <div>
                  <Label htmlFor="habit-unit">Unit</Label>
                  <Select
                    value={newHabit.unit}
                    onValueChange={(value) => setNewHabit((prev) => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="times">times</SelectItem>
                      <SelectItem value="minutes">minutes</SelectItem>
                      <SelectItem value="hours">hours</SelectItem>
                      <SelectItem value="glasses">glasses</SelectItem>
                      <SelectItem value="pages">pages</SelectItem>
                      <SelectItem value="steps">steps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={addHabit} className="flex-1 hover:scale-105 transition-transform">
                  Add Habit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                  className="hover:scale-105 transition-transform"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Progress */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-left duration-700 delay-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Today's Progress
              </h3>
              <p className="text-sm text-muted-foreground">Keep up the great work!</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary animate-pulse">{getCompletionRate()}%</div>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={getCompletionRate()} className="h-3 transition-all duration-500" />
        </CardContent>
      </Card>

      {/* Habits List */}
      <div className="grid gap-4">
        {habits.map((habit, index) => {
          const Icon = IconComponent(habit.icon)
          const progressPercentage = (habit.currentValue / habit.targetValue) * 100
          const isJustCompleted = completedHabits.includes(habit.id)

          return (
            <Card
              key={habit.id}
              className={`transition-all duration-500 hover:shadow-lg hover:scale-[1.02] animate-in slide-in-from-right duration-700 ${
                habit.completedToday
                  ? "bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-800"
                  : "bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90"
              } ${isJustCompleted ? "animate-bounce shadow-2xl ring-4 ring-green-400/50" : ""}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        habit.completedToday
                          ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg"
                          : "bg-gradient-to-br from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${habit.completedToday ? "text-white" : "text-primary"} transition-colors duration-300`}
                      />
                      {isJustCompleted && <Sparkles className="absolute h-4 w-4 text-yellow-400 animate-ping" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{habit.name}</h4>
                      {habit.description && <p className="text-sm text-muted-foreground">{habit.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs transition-all duration-300 ${
                        habit.streak > 0
                          ? "bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-200 text-orange-800 dark:from-orange-950 dark:to-yellow-950 dark:border-orange-800 dark:text-orange-200"
                          : ""
                      }`}
                    >
                      🔥 {habit.streak} day streak
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="text-muted-foreground hover:text-destructive hover:scale-110 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Progress</span>
                    <span className="font-semibold text-lg">
                      {habit.currentValue} / {habit.targetValue} {habit.unit}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 transition-all duration-500" />

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={habit.completedToday ? "default" : "secondary"}
                      className={`transition-all duration-300 ${
                        habit.completedToday
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          : ""
                      }`}
                    >
                      {habit.completedToday ? "✅ Completed" : habit.currentValue > 0 ? "🔄 In Progress" : "⏳ Pending"}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateHabitProgress(habit.id, -1)}
                        disabled={habit.currentValue <= 0}
                        className="h-9 w-9 p-0 hover:scale-110 transition-all duration-200 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateHabitProgress(habit.id, 1)}
                        disabled={habit.currentValue >= habit.targetValue}
                        className="h-9 w-9 p-0 hover:scale-110 transition-all duration-200 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950/20"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      {habit.completedToday && (
                        <div className="flex items-center gap-1 text-green-600 ml-2 animate-in slide-in-from-right duration-300">
                          <Check className="h-5 w-5 animate-pulse" />
                          <span className="text-sm font-semibold">Done!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {habits.length === 0 && (
        <Card className="bg-card/50 border-dashed border-2 hover:border-primary/50 transition-all duration-300 animate-in fade-in duration-700">
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              No habits yet
            </h3>
            <p className="text-muted-foreground mb-6">Start building better habits by adding your first one</p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="gap-2 hover:scale-105 transition-all duration-200 bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Add Your First Habit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
