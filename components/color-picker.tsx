"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Palette } from "lucide-react"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  onClose: () => void
}

const PRESET_COLORS = [
  "#ffffff", // White
  "#f8fafc", // Slate 50
  "#f1f5f9", // Slate 100
  "#e2e8f0", // Slate 200
  "#fef2f2", // Red 50
  "#fef7f0", // Orange 50
  "#fffbeb", // Amber 50
  "#f7fee7", // Lime 50
  "#f0fdf4", // Green 50
  "#ecfdf5", // Emerald 50
  "#f0fdfa", // Teal 50
  "#f0f9ff", // Sky 50
  "#eff6ff", // Blue 50
  "#eef2ff", // Indigo 50
  "#f5f3ff", // Violet 50
  "#faf5ff", // Purple 50
  "#fdf2f8", // Pink 50
  "#fff1f2", // Rose 50
]

const GRADIENT_BACKGROUNDS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
]

export function ColorPicker({ color, onChange, onClose }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(color)
  const [showGradients, setShowGradients] = useState(false)

  const handleColorChange = (newColor: string) => {
    setCustomColor(newColor)
    onChange(newColor)
  }

  const handleGradientChange = (gradient: string) => {
    // For gradients, we'll apply them to the body directly
    document.body.style.background = gradient
    document.body.style.backgroundColor = "" // Clear solid color
    localStorage.setItem("smartsync-bg-gradient", gradient)
    localStorage.removeItem("smartsync-bg-color")
  }

  const resetToSolid = () => {
    document.body.style.background = ""
    document.body.style.backgroundColor = customColor
    localStorage.removeItem("smartsync-bg-gradient")
    localStorage.setItem("smartsync-bg-color", customColor)
  }

  return (
    <Card className="w-80 shadow-lg border-border/50 bg-card/95 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Background Color
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Color</label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={customColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-16 h-10 p-1 border-border"
            />
            <Input
              type="text"
              value={customColor}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>

        {/* Preset Colors */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Preset Colors</label>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => handleColorChange(presetColor)}
                className="w-8 h-8 rounded-md border-2 border-border hover:border-primary transition-colors"
                style={{ backgroundColor: presetColor }}
                title={presetColor}
              />
            ))}
          </div>
        </div>

        {/* Gradient Toggle */}
        <div className="flex gap-2">
          <Button
            variant={!showGradients ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setShowGradients(false)
              resetToSolid()
            }}
          >
            Solid Colors
          </Button>
          <Button variant={showGradients ? "default" : "outline"} size="sm" onClick={() => setShowGradients(true)}>
            Gradients
          </Button>
        </div>

        {/* Gradient Options */}
        {showGradients && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Gradient Backgrounds</label>
            <div className="grid grid-cols-2 gap-2">
              {GRADIENT_BACKGROUNDS.map((gradient, index) => (
                <button
                  key={index}
                  onClick={() => handleGradientChange(gradient)}
                  className="w-full h-12 rounded-md border-2 border-border hover:border-primary transition-colors"
                  style={{ background: gradient }}
                  title={`Gradient ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={() => {
            handleColorChange("#ffffff")
            document.body.style.background = ""
            localStorage.removeItem("smartsync-bg-gradient")
          }}
          className="w-full"
        >
          Reset to Default
        </Button>
      </CardContent>
    </Card>
  )
}
