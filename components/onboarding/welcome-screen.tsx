"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react"

interface WelcomeScreenProps {
  onNext: () => void
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to SmartSync
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
            Your personal wellness coach that adapts to your lifestyle and helps you achieve your goals
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Track Habits</h3>
              <p className="text-xs text-muted-foreground mt-1">Build lasting routines</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/5 border border-secondary/10">
              <TrendingUp className="h-8 w-8 text-secondary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Monitor Progress</h3>
              <p className="text-xs text-muted-foreground mt-1">See your growth</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/5 border border-accent/10">
              <Sparkles className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Get Insights</h3>
              <p className="text-xs text-muted-foreground mt-1">Smart recommendations</p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button
              onClick={onNext}
              size="lg"
              className="w-full md:w-auto px-8 py-3 text-base font-medium group transition-all duration-300 hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
