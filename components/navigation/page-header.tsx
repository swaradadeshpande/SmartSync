"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Palette } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  showSettings?: boolean
  showColorPicker?: boolean
  onColorPickerToggle?: () => void
  rightActions?: React.ReactNode
}

export function PageHeader({
  title,
  subtitle,
  showBackButton = true,
  showSettings = true,
  showColorPicker = false,
  onColorPickerToggle,
  rightActions,
}: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className="flex items-center justify-between mb-8 animate-in slide-in-from-top duration-700">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="transition-all duration-200 hover:scale-105 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showColorPicker && onColorPickerToggle && (
          <Button
            variant="outline"
            size="icon"
            onClick={onColorPickerToggle}
            className="transition-all duration-200 hover:scale-105 bg-transparent"
          >
            <Palette className="h-4 w-4" />
          </Button>
        )}
        {showSettings && (
          <Link href="/settings">
            <Button
              variant="outline"
              size="icon"
              className="transition-all duration-200 hover:scale-105 bg-transparent"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        )}
        {rightActions}
      </div>
    </header>
  )
}
