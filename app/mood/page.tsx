"use client"

import { MoodTracker } from "@/components/mood/mood-tracker"
import { PageHeader } from "@/components/navigation/page-header"

export default function MoodPage() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Mood Tracker" subtitle="Track your emotional well-being and patterns" />
        <MoodTracker />
      </div>
    </div>
  )
}
