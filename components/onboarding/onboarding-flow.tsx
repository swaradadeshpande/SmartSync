"use client"

import { useState } from "react"
import { WelcomeScreen } from "./welcome-screen"
import { LifestyleQuiz, type QuizAnswers } from "./lifestyle-quiz"
import { PersonalizedPlan } from "./personalized-plan"

interface OnboardingFlowProps {
  onComplete: (userData: QuizAnswers) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null)

  const handleWelcomeNext = () => {
    setCurrentStep(1)
  }

  const handleQuizBack = () => {
    setCurrentStep(0)
  }

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers)
    setCurrentStep(2)
  }

  const handlePlanComplete = () => {
    if (quizAnswers) {
      // Save user data to localStorage
      localStorage.setItem("smartsync-user-data", JSON.stringify(quizAnswers))
      localStorage.setItem("smartsync-onboarding-complete", "true")
      onComplete(quizAnswers)
    }
  }

  switch (currentStep) {
    case 0:
      return <WelcomeScreen onNext={handleWelcomeNext} />
    case 1:
      return <LifestyleQuiz onBack={handleQuizBack} onComplete={handleQuizComplete} />
    case 2:
      return quizAnswers ? <PersonalizedPlan answers={quizAnswers} onComplete={handlePlanComplete} /> : null
    default:
      return null
  }
}
