"use client"

import { SmartRecommendations } from "@/components/insights/smart-recommendations"
import { PageHeader } from "@/components/navigation/page-header"

export default function InsightsPage() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Smart Insights" subtitle="Personalized recommendations for your wellness journey" />
        <SmartRecommendations />
      </div>
    </div>
  )
}
