"use client"

import { Beaker } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 text-primary-foreground">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Emma!</h2>
        <p className="text-lg text-primary-foreground/90 mb-4">Ready to explore the world of science?</p>
        <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
          Level 5 • 847 XP
        </Badge>
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
        <Beaker className="w-32 h-32" />
      </div>
    </div>
  )
}
