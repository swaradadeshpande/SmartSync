"use client"

import { HabitTracker } from "@/components/habits/habit-tracker"
import { PageHeader } from "@/components/navigation/page-header"

export default function HabitsPage() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Habit Tracker" subtitle="Build better habits, one day at a time" />
        <HabitTracker />
      </div>
    </div>
  )
}
