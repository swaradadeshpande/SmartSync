"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Heart, TrendingUp, MessageCircle, Plus, Sparkles } from "lucide-react"

export interface MoodEntry {
  id: string
  mood: number // 1-5 scale
  emoji: string
  label: string
  note?: string
  timestamp: string
  date: string
}

const moodOptions = [
  {
    value: 1,
    emoji: "😢",
    label: "Very Sad",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    value: 2,
    emoji: "😔",
    label: "Sad",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    value: 3,
    emoji: "😐",
    label: "Neutral",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  {
    value: 4,
    emoji: "😊",
    label: "Happy",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    value: 5,
    emoji: "😄",
    label: "Very Happy",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
]

export function MoodTracker() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [showMoodDialog, setShowMoodDialog] = useState(false)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [moodNote, setMoodNote] = useState("")
  const [todaysMood, setTodaysMood] = useState<MoodEntry | null>(null)
  const [justLogged, setJustLogged] = useState(false)

  // Load mood entries from localStorage
  useEffect(() => {
    const savedMoods = localStorage.getItem("smartsync-moods")
    if (savedMoods) {
      const parsedMoods = JSON.parse(savedMoods)
      setMoodEntries(parsedMoods)

      // Check if there's a mood entry for today
      const today = new Date().toDateString()
      const todayEntry = parsedMoods.find((entry: MoodEntry) => entry.date === today)
      setTodaysMood(todayEntry || null)
    }
  }, [])

  // Save mood entries to localStorage whenever they change
  useEffect(() => {
    if (moodEntries.length > 0) {
      localStorage.setItem("smartsync-moods", JSON.stringify(moodEntries))
    }
  }, [moodEntries])

  const addMoodEntry = () => {
    if (selectedMood === null) return

    const moodOption = moodOptions.find((option) => option.value === selectedMood)
    if (!moodOption) return

    const today = new Date().toDateString()
    const now = new Date()

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      emoji: moodOption.emoji,
      label: moodOption.label,
      note: moodNote.trim() || undefined,
      timestamp: now.toISOString(),
      date: today,
    }

    // Remove any existing entry for today and add the new one
    setMoodEntries((prev) => {
      const filtered = prev.filter((entry) => entry.date !== today)
      return [newEntry, ...filtered]
    })

    setTodaysMood(newEntry)
    setSelectedMood(null)
    setMoodNote("")
    setShowMoodDialog(false)

    // Add celebration animation for mood logging
    setJustLogged(true)
    setTimeout(() => setJustLogged(false), 2000)
  }

  const getWeeklyMoodAverage = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const weeklyEntries = moodEntries.filter((entry) => new Date(entry.timestamp) >= oneWeekAgo)

    if (weeklyEntries.length === 0) return 0

    const average = weeklyEntries.reduce((sum, entry) => sum + entry.mood, 0) / weeklyEntries.length
    return Math.round(average * 10) / 10
  }

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

  const getRecentMoods = () => {
    return moodEntries.slice(0, 7)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    }
  }

  const weeklyAverage = getWeeklyMoodAverage()
  const moodStreak = getMoodStreak()
  const recentMoods = getRecentMoods()

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between animate-in slide-in-from-top duration-700">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Mood Tracker
          </h2>
          <p className="text-muted-foreground">How are you feeling today?</p>
        </div>
        <Dialog open={showMoodDialog} onOpenChange={setShowMoodDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 hover:scale-105 transition-all duration-200 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg">
              <Heart className="h-4 w-4" />
              {todaysMood ? "Update Mood" : "Log Mood"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                How are you feeling?
              </DialogTitle>
              <DialogDescription>Select your current mood and add any notes</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Mood Selection */}
              <div>
                <Label className="text-base font-medium">Choose your mood</Label>
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {moodOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedMood(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-110 ${
                        selectedMood === option.value
                          ? `border-primary ${option.bgColor} scale-110 shadow-lg ring-2 ring-primary/20`
                          : "border-border hover:border-primary/50 hover:shadow-md"
                      }`}
                    >
                      <div className="text-3xl mb-2 transition-transform duration-200">{option.emoji}</div>
                      <div className="text-xs font-medium text-center">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <Label htmlFor="mood-note">Add a note (optional)</Label>
                <Textarea
                  id="mood-note"
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="What's on your mind? How was your day?"
                  className="mt-2 resize-none transition-all duration-200 focus:scale-[1.02]"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={addMoodEntry}
                  disabled={selectedMood === null}
                  className="flex-1 hover:scale-105 transition-all duration-200 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  {todaysMood ? "Update Mood" : "Save Mood"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowMoodDialog(false)}
                  className="hover:scale-105 transition-transform"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Mood */}
      {todaysMood ? (
        <Card
          className={`bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-left duration-700 delay-100 ${justLogged ? "animate-bounce shadow-2xl ring-4 ring-pink-400/50" : ""}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl animate-pulse relative">
                {todaysMood.emoji}
                {justLogged && <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-ping" />}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Today's Mood: {todaysMood.label}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Logged at{" "}
                  {new Date(todaysMood.timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                {todaysMood.note && (
                  <div className="bg-card/50 rounded-lg p-3 mt-3 border border-border/50">
                    <p className="text-sm">{todaysMood.note}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card/50 border-dashed border-2 hover:border-primary/50 transition-all duration-300 animate-in fade-in duration-700">
          <CardContent className="p-8 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              No mood logged today
            </h3>
            <p className="text-muted-foreground mb-6">Take a moment to check in with yourself</p>
            <Button
              onClick={() => setShowMoodDialog(true)}
              className="gap-2 hover:scale-105 transition-all duration-200 bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Log Your Mood
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mood Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Weekly Average",
            value: weeklyAverage || "N/A",
            subtitle: "Out of 5.0",
            icon: TrendingUp,
            color: "text-blue-500",
          },
          {
            title: "Check-in Streak",
            value: `${moodStreak} days`,
            subtitle: "Keep it up!",
            icon: Calendar,
            color: "text-green-500",
          },
          {
            title: "Total Entries",
            value: moodEntries.length,
            subtitle: "Mood logs",
            icon: MessageCircle,
            color: "text-purple-500",
          },
        ].map((stat, index) => (
          <Card
            key={stat.title}
            className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom duration-700"
            style={{ animationDelay: `${(index + 2) * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Mood History */}
      <div className="animate-in slide-in-from-bottom duration-700 delay-300">
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Recent Mood History
        </h3>
        {recentMoods.length > 0 ? (
          <div className="space-y-3">
            {recentMoods.map((entry, index) => {
              const moodOption = moodOptions.find((opt) => opt.value === entry.mood)
              return (
                <Card
                  key={entry.id}
                  className={`bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-in slide-in-from-right duration-500 ${moodOption?.bgColor} ${moodOption?.borderColor}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl animate-pulse">{entry.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-lg">{entry.label}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs bg-background/50">
                              {formatDate(entry.timestamp)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        {entry.note && (
                          <div className="bg-background/30 rounded-lg p-3 mt-2 border border-border/30">
                            <p className="text-sm text-muted-foreground">{entry.note}</p>
                          </div>
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
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3 animate-pulse" />
              <p className="text-muted-foreground">No mood entries yet. Start tracking your mood to see patterns!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mood Insights */}
      {moodEntries.length >= 3 && (
        <Card className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-blue-200/50 dark:from-blue-950/20 dark:to-purple-950/20 dark:border-blue-800/50 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom duration-700 delay-400">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mood Insights
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyAverage >= 4 && (
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 animate-in slide-in-from-left duration-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm">You've been feeling great this week! Keep up the positive momentum. ✨</p>
                </div>
              )}
              {weeklyAverage < 3 && weeklyAverage > 0 && (
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 animate-in slide-in-from-left duration-300 delay-100">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <p className="text-sm">
                    It looks like you've been having some tough days. Remember to take care of yourself. 💙
                  </p>
                </div>
              )}
              {moodStreak >= 7 && (
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 animate-in slide-in-from-left duration-300 delay-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <p className="text-sm">
                    Amazing! You've been consistently tracking your mood for {moodStreak} days! 🎉
                  </p>
                </div>
              )}
              {moodStreak >= 3 && moodStreak < 7 && (
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 animate-in slide-in-from-left duration-300 delay-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-sm">Great job staying consistent with mood tracking! 🌟</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
