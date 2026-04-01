"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "@/components/navigation/page-header"
import { ColorPicker } from "@/components/color-picker"
import { User, Bell, Palette, Shield, Download, Trash2, Camera, Save, RefreshCw } from "lucide-react"
import type { QuizAnswers } from "@/components/onboarding/lifestyle-quiz"

interface UserProfile {
  name: string
  email: string
  avatar?: string
  joinDate: string
  preferences: {
    notifications: boolean
    darkMode: boolean
    weeklyReports: boolean
    motivationalQuotes: boolean
  }
}

export default function SettingsPage() {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [userData, setUserData] = useState<QuizAnswers | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    joinDate: new Date().toLocaleDateString(),
    preferences: {
      notifications: true,
      darkMode: false,
      weeklyReports: true,
      motivationalQuotes: true,
    },
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load saved data
    const savedColor = localStorage.getItem("smartsync-bg-color")
    const savedUserData = localStorage.getItem("smartsync-user-data")
    const savedProfile = localStorage.getItem("smartsync-user-profile")

    if (savedColor) {
      setBackgroundColor(savedColor)
    }

    if (savedUserData) {
      setUserData(JSON.parse(savedUserData))
    }

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    } else if (savedUserData) {
      // Initialize profile from onboarding data
      const data = JSON.parse(savedUserData)
      setUserProfile((prev) => ({
        ...prev,
        name: data.name || "SmartSync User",
        email: data.email || "",
      }))
    }
  }, [])

  const handleColorChange = (color: string) => {
    setBackgroundColor(color)
    document.body.style.backgroundColor = color
    localStorage.setItem("smartsync-bg-color", color)
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    localStorage.setItem("smartsync-user-profile", JSON.stringify(userProfile))
    setIsEditing(false)
    setIsSaving(false)
  }

  const handlePreferenceChange = (key: keyof UserProfile["preferences"], value: boolean) => {
    setUserProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }))
  }

  const resetOnboarding = () => {
    localStorage.removeItem("smartsync-onboarding-complete")
    localStorage.removeItem("smartsync-user-data")
    window.location.href = "/"
  }

  const exportData = () => {
    const data = {
      profile: userProfile,
      userData: userData,
      habits: JSON.parse(localStorage.getItem("smartsync-habits") || "[]"),
      moods: JSON.parse(localStorage.getItem("smartsync-moods") || "[]"),
      badges: JSON.parse(localStorage.getItem("smartsync-badges") || "[]"),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "smartsync-data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      localStorage.clear()
      window.location.href = "/"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Settings"
          subtitle="Manage your profile and preferences"
          showColorPicker={true}
          onColorPickerToggle={() => setShowColorPicker(!showColorPicker)}
          showSettings={false}
        />

        {/* Color Picker */}
        {showColorPicker && (
          <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
            <ColorPicker
              color={backgroundColor}
              onChange={handleColorChange}
              onClose={() => setShowColorPicker(false)}
            />
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Manage your personal information and account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg bg-primary/10">
                      {getInitials(userProfile.name || "SU")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-transparent"
                    onClick={() => {
                      /* TODO: Implement avatar upload */
                    }}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile((prev) => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Member since {userProfile.joinDate}</Badge>
                    {userData && <Badge variant="outline">Goals: {userData.goals.slice(0, 2).join(", ")}</Badge>}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <User className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                      {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your SmartSync experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-base">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive reminders and updates</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={userProfile.preferences.notifications}
                    onCheckedChange={(checked) => handlePreferenceChange("notifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-reports" className="text-base">
                      Weekly Reports
                    </Label>
                    <p className="text-sm text-muted-foreground">Get weekly progress summaries</p>
                  </div>
                  <Switch
                    id="weekly-reports"
                    checked={userProfile.preferences.weeklyReports}
                    onCheckedChange={(checked) => handlePreferenceChange("weeklyReports", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="motivational-quotes" className="text-base">
                      Motivational Quotes
                    </Label>
                    <p className="text-sm text-muted-foreground">Show daily inspiration</p>
                  </div>
                  <Switch
                    id="motivational-quotes"
                    checked={userProfile.preferences.motivationalQuotes}
                    onCheckedChange={(checked) => handlePreferenceChange("motivationalQuotes", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Section */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of your app</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Background Color</Label>
                  <p className="text-sm text-muted-foreground mb-3">Current color: {backgroundColor}</p>
                  <Button variant="outline" onClick={() => setShowColorPicker(!showColorPicker)} className="gap-2">
                    <Palette className="h-4 w-4" />
                    Change Background
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management Section */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Export, backup, or reset your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" onClick={exportData} className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                  <Button variant="outline" onClick={resetOnboarding} className="gap-2 bg-transparent">
                    <RefreshCw className="h-4 w-4" />
                    Reset Onboarding
                  </Button>
                  <Button variant="destructive" onClick={clearAllData} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear All Data
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Export your data to keep a backup, or reset your account to start fresh.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
