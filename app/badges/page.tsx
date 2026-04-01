"use client"

import { BadgeSystem } from "@/components/gamification/badge-system"
import { PageHeader } from "@/components/navigation/page-header"

export default function BadgesPage() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto">
        <PageHeader title="Achievement Badges" subtitle="Celebrate your wellness journey milestones" />
        <BadgeSystem />
      </div>
    </div>
  )
}
