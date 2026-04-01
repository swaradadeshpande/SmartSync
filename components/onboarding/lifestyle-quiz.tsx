"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

interface LifestyleQuizProps {
  onBack: () => void
  onComplete: (answers: QuizAnswers) => void
}

export interface QuizAnswers {
  fitnessLevel: string
  sleepHours: string
  stressLevel: string
  goals: string[]
  timeAvailable: string
}

const questions = [
  {
    id: "fitnessLevel",
    title: "What's your current fitness level?",
    options: [
      { value: "beginner", label: "Beginner - Just starting out" },
      { value: "intermediate", label: "Intermediate - Regular exercise" },
      { value: "advanced", label: "Advanced - Very active lifestyle" },
    ],
  },
  {
    id: "sleepHours",
    title: "How many hours do you typically sleep?",
    options: [
      { value: "less-6", label: "Less than 6 hours" },
      { value: "6-7", label: "6-7 hours" },
      { value: "7-8", label: "7-8 hours" },
      { value: "more-8", label: "More than 8 hours" },
    ],
  },
  {
    id: "stressLevel",
    title: "How would you rate your stress level?",
    options: [
      { value: "low", label: "Low - Generally relaxed" },
      { value: "moderate", label: "Moderate - Some daily stress" },
      { value: "high", label: "High - Often overwhelmed" },
    ],
  },
  {
    id: "timeAvailable",
    title: "How much time can you dedicate daily?",
    options: [
      { value: "15-min", label: "15 minutes or less" },
      { value: "30-min", label: "30 minutes" },
      { value: "1-hour", label: "1 hour" },
      { value: "more-1-hour", label: "More than 1 hour" },
    ],
  },
]

export function LifestyleQuiz({ onBack, onComplete }: LifestyleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const progress = ((currentQuestion + 1) / (questions.length + 1)) * 100

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      // Show goals selection
      setCurrentQuestion(questions.length)
    }
  }

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]))
  }

  const handleComplete = () => {
    const finalAnswers: QuizAnswers = {
      ...(answers as Omit<QuizAnswers, "goals">),
      goals: selectedGoals,
    }
    onComplete(finalAnswers)
  }

  const canProceed =
    currentQuestion < questions.length
      ? answers[questions[currentQuestion].id as keyof QuizAnswers]
      : selectedGoals.length > 0

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {questions.length + 1}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {currentQuestion < questions.length ? (
            // Regular questions
            <div className="space-y-6">
              <div>
                <CardTitle className="text-xl mb-2">{questions[currentQuestion].title}</CardTitle>
                <CardDescription>Choose the option that best describes you</CardDescription>
              </div>

              <RadioGroup
                value={answers[questions[currentQuestion].id as keyof QuizAnswers] || ""}
                onValueChange={(value) => handleAnswer(questions[currentQuestion].id, value)}
                className="space-y-3"
              >
                {questions[currentQuestion].options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            // Goals selection
            <div className="space-y-6">
              <div>
                <CardTitle className="text-xl mb-2">What are your main goals?</CardTitle>
                <CardDescription>Select all that apply (choose at least one)</CardDescription>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Improve fitness",
                  "Better sleep",
                  "Reduce stress",
                  "Lose weight",
                  "Build muscle",
                  "Increase energy",
                  "Better nutrition",
                  "Mental wellness",
                ].map((goal) => (
                  <div
                    key={goal}
                    onClick={() => handleGoalToggle(goal)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedGoals.includes(goal)
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border/50 hover:bg-accent/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{goal}</span>
                      {selectedGoals.includes(goal) && <CheckCircle className="h-5 w-5" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={currentQuestion < questions.length ? handleNext : handleComplete}
              disabled={!canProceed}
              size="lg"
              className="px-8 group transition-all duration-300 hover:scale-105"
            >
              {currentQuestion < questions.length ? "Next" : "Complete Setup"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
