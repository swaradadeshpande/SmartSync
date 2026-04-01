"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Target, Clock, Zap, ArrowRight } from "lucide-react"
import type { QuizAnswers } from "./lifestyle-quiz"

interface PersonalizedPlanProps {
  answers: QuizAnswers
  onComplete: () => void
}

export function PersonalizedPlan({ answers, onComplete }: PersonalizedPlanProps) {
  // Generate personalized recommendations based on quiz answers
  const getRecommendations = () => {
    const recommendations = []

    // Fitness-based recommendations
    if (answers.fitnessLevel === "beginner") {
      recommendations.push({
        title: "Start with 10-minute walks",
        description: "Build your fitness foundation gradually",
        icon: Target,
        category: "Fitness",
      })
    } else if (answers.fitnessLevel === "intermediate") {
      recommendations.push({
        title: "30-minute workout sessions",
        description: "Maintain your current fitness level",
        icon: Target,
        category: "Fitness",
      })
    }

    // Sleep-based recommendations
    if (answers.sleepHours === "less-6" || answers.sleepHours === "6-7") {
      recommendations.push({
        title: "Improve sleep hygiene",
        description: "Aim for 7-8 hours of quality sleep",
        icon: Clock,
        category: "Sleep",
      })
    }

    // Stress-based recommendations
    if (answers.stressLevel === "high" || answers.stressLevel === "moderate") {
      recommendations.push({
        title: "Daily meditation",
        description: "5-10 minutes of mindfulness practice",
        icon: Zap,
        category: "Wellness",
      })
    }

    // Goal-based recommendations
    if (answers.goals.includes("Better nutrition")) {
      recommendations.push({
        title: "Track water intake",
        description: "Stay hydrated with 8 glasses daily",
        icon: Target,
        category: "Nutrition",
      })
    }

    return recommendations
  }

  const recommendations = getRecommendations()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-4xl bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold">Your Personalized Plan is Ready!</CardTitle>
          <CardDescription className="text-lg max-w-2xl mx-auto">
            Based on your responses, we've created a customized wellness plan just for you
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Goals Summary */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Your Goals</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {answers.goals.map((goal) => (
                <Badge key={goal} variant="secondary" className="px-3 py-1">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>

          {/* Recommended Habits */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Recommended Daily Habits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className="bg-card/50 border-border/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <rec.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{rec.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {rec.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Time Commitment */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Daily Time Commitment</h3>
              <p className="text-2xl font-bold text-primary mb-2">
                {answers.timeAvailable === "15-min"
                  ? "15 minutes"
                  : answers.timeAvailable === "30-min"
                    ? "30 minutes"
                    : answers.timeAvailable === "1-hour"
                      ? "1 hour"
                      : "1+ hours"}
              </p>
              <p className="text-sm text-muted-foreground">Perfect! We've tailored your plan to fit your schedule</p>
            </CardContent>
          </Card>

          <div className="text-center pt-4">
            <Button
              onClick={onComplete}
              size="lg"
              className="px-8 py-3 text-base font-medium group transition-all duration-300 hover:scale-105"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
