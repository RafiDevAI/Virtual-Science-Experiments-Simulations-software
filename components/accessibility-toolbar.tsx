"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Type, Palette, Volume2, Settings, X } from "lucide-react"

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState([16])
  const [contrast, setContrast] = useState([1])
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    // Apply accessibility settings to document
    document.documentElement.style.fontSize = `${fontSize[0]}px`
    document.documentElement.style.filter = `contrast(${contrast[0]})`

    if (reducedMotion) {
      document.documentElement.style.setProperty("--animation-duration", "0s")
    } else {
      document.documentElement.style.removeProperty("--animation-duration")
    }

    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [fontSize, contrast, reducedMotion, highContrast])

  // Keyboard shortcut to open accessibility menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "a") {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Accessibility toolbar toggle */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 rounded-full w-12 h-12 p-0"
        aria-label="Open accessibility settings (Alt + A)"
        title="Accessibility Settings (Alt + A)"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Accessibility panel */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-40 w-80 max-h-96 overflow-y-auto">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Accessibility Settings</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility settings"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Font Size */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Type className="w-4 h-4" />
                  <label className="text-sm font-medium">Font Size: {fontSize[0]}px</label>
                </div>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                  aria-label="Adjust font size"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-4 h-4" />
                  <label className="text-sm font-medium">Contrast: {Math.round(contrast[0] * 100)}%</label>
                </div>
                <Slider
                  value={contrast}
                  onValueChange={setContrast}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                  aria-label="Adjust contrast"
                />
              </div>

              {/* High Contrast Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <label className="text-sm font-medium">High Contrast</label>
                </div>
                <Switch
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                  aria-label="Toggle high contrast mode"
                />
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <label className="text-sm font-medium">Reduce Motion</label>
                </div>
                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} aria-label="Toggle reduced motion" />
              </div>

              {/* Language Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => {
                  setFontSize([16])
                  setContrast([1])
                  setReducedMotion(false)
                  setHighContrast(false)
                  setLanguage("en")
                }}
              >
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
