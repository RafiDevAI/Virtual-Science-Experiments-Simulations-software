"use client"

import { useRef, useState, useEffect } from "react"
import SolarSystemEducational from "@/components/solar-system-educational"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Globe,
  Maximize,
  Minimize,
  Target,
  BookOpen,
  GraduationCap,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Rocket,
} from "lucide-react"
import Link from "next/link"
import { ExperimentCompletionButton } from "@/components/experiment-completion-button"
import { useRouter } from "next/navigation"

export default function SolarSystemPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showDetailedInfo, setShowDetailedInfo] = useState(true)
  const [showWelcomeCard, setShowWelcomeCard] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const dismissed = localStorage.getItem("solar-system-welcome-dismissed")
    if (!dismissed) {
      setShowWelcomeCard(true)
    }
  }, [])

  const dismissWelcomeCard = () => {
    setShowWelcomeCard(false)
    localStorage.setItem("solar-system-welcome-dismissed", "true")
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const backToExperimentsFullscreen = () => {
    router.push("/experiments")
    setTimeout(() => {
      document.documentElement.requestFullscreen()
    }, 100)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-purple-950/20 via-black to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      {!isFullscreen && (
        <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/experiments">
                  <Button variant="ghost" size="sm" className="gap-2 text-white/90 hover:text-white hover:bg-white/10">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                </Link>
                <Button
                  onClick={backToExperimentsFullscreen}
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/30"
                  title="Return to experiments overview in fullscreen mode"
                >
                  <Maximize className="w-4 h-4" />
                  <span className="hidden lg:inline">Back to Experiments, full screen</span>
                  <span className="hidden md:inline lg:hidden">Experiments ⛶</span>
                </Button>
                <div className="h-8 w-px bg-white/20" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.6)] relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
                    <Globe className="w-6 h-6 text-white relative z-10" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                      Interactive Solar System
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </h1>
                    <p className="text-sm text-white/60">Explore our cosmic neighborhood</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="hidden sm:flex bg-purple-500/20 text-purple-300 border-purple-500/30"
                >
                  Astronomy
                </Badge>
                <Badge variant="outline" className="hidden sm:flex bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  3D Simulation
                </Badge>
                <Button
                  onClick={toggleFullscreen}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Maximize className="w-4 h-4" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      {isFullscreen && (
        <Button
          onClick={backToExperimentsFullscreen}
          variant="outline"
          size="sm"
          className="fixed top-6 left-6 z-50 bg-black/80 backdrop-blur-sm border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.4)] gap-2"
          title="Return to experiments overview in fullscreen mode"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Experiments, full screen</span>
          <span className="sm:hidden">Experiments ⛶</span>
        </Button>
      )}

      {!isFullscreen ? (
        <div className="container mx-auto px-4 py-8 relative z-10">
          {showWelcomeCard && (
            <Card className="mb-6 border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.3)] bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-cyan-900/40 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        Welcome to the Solar System!
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                      </CardTitle>
                      <p className="text-sm text-white/70 mt-1">Your cosmic journey begins here</p>
                    </div>
                  </div>
                  <Button
                    onClick={dismissWelcomeCard}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-white/90">
                  <p className="leading-relaxed">
                    🌟 <strong className="text-cyan-300">Click any planet</strong> to discover fascinating facts about
                    our solar system
                  </p>
                  <p className="leading-relaxed">
                    🎮 <strong className="text-purple-300">Drag, zoom, and rotate</strong> to explore from every angle
                  </p>
                  <p className="leading-relaxed">
                    ⚡ <strong className="text-blue-300">Use the controls</strong> to adjust speed, toggle orbits, and
                    more
                  </p>
                  <div className="pt-2 border-t border-white/10 mt-3">
                    <p className="text-xs text-white/60">💡 Tip: This message will not appear again once dismissed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="h-[600px] rounded-2xl overflow-hidden border border-purple-500/30 shadow-[0_0_50px_rgba(139,92,246,0.3)] bg-black relative">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none z-10" />
                <SolarSystemEducational onPlanetSelect={setSelectedPlanet} />
              </div>
            </div>

            <div className="space-y-6">
              <ExperimentCompletionButton experimentId="solar-system" experimentTitle="Interactive Solar System" />

              <Card className="border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] bg-black/60 backdrop-blur-xl overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-cyan-500/10 transition-colors"
                  onClick={() => setShowDetailedInfo(!showDetailedInfo)}
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold text-white">Detailed Information</h3>
                  </div>
                  {showDetailedInfo ? (
                    <ChevronUp className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-cyan-400" />
                  )}
                </div>
                <div
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{
                    maxHeight: showDetailedInfo ? "100px" : "0px",
                    opacity: showDetailedInfo ? 1 : 0,
                  }}
                >
                  <div className="px-4 pb-4">
                    <p className="text-sm text-white/70">
                      Toggle to show or hide detailed information cards below for a cleaner interface.
                    </p>
                  </div>
                </div>
              </Card>

              {selectedPlanet && (
                <Card className="border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.3)] bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-purple-900/40 backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                          style={{
                            background: `linear-gradient(135deg, ${selectedPlanet.color}, ${selectedPlanet.color}dd)`,
                          }}
                        >
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white">{selectedPlanet.name}</CardTitle>
                          <p className="text-xs text-white/60 mt-0.5">Planet Information</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setSelectedPlanet(null)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <h3 className="text-xs font-semibold text-cyan-300 mb-1">Temperature</h3>
                      <p className="text-sm text-white/90">{selectedPlanet.temperature}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <h3 className="text-xs font-semibold text-purple-300 mb-1">Composition</h3>
                      <p className="text-sm text-white/90">{selectedPlanet.composition}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                      <h3 className="text-xs font-semibold text-pink-300 mb-1.5">Interesting Facts</h3>
                      <ul className="space-y-1.5">
                        {selectedPlanet.facts.map((fact: string, i: number) => (
                          <li key={i} className="text-sm text-white/90 flex items-start gap-2">
                            <span className="text-pink-400 mt-0.5">•</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div
                className="space-y-6 transition-all duration-500 ease-in-out"
                style={{
                  maxHeight: showDetailedInfo ? "2000px" : "0px",
                  opacity: showDetailedInfo ? 1 : 0,
                  overflow: "hidden",
                }}
              >
                <Card className="border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.2)] bg-black/60 backdrop-blur-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                      <Target className="w-5 h-5 text-cyan-400" />
                      Learning Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        <p className="text-white/90">Understand planetary order and relative sizes</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                        <p className="text-white/90">Observe orbital mechanics and periods</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                        <p className="text-white/90">Compare planetary characteristics</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 shadow-[0_0_10px_rgba(244,114,182,0.8)]" />
                        <p className="text-white/90">Explore asteroid belts and dwarf planets</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] bg-black/60 backdrop-blur-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                      How to Use
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                        <span className="text-cyan-300 font-semibold">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Click any planet</p>
                        <p className="text-white/60 text-xs">View detailed information</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        <span className="text-purple-300 font-semibold">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Drag to rotate</p>
                        <p className="text-white/60 text-xs">Explore different angles</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <span className="text-blue-300 font-semibold">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Scroll to zoom</p>
                        <p className="text-white/60 text-xs">Get closer or see the big picture</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                        <span className="text-pink-300 font-semibold">4</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Use controls</p>
                        <p className="text-white/60 text-xs">Toggle features and adjust speed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.2)] bg-black/60 backdrop-blur-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                      <GraduationCap className="w-5 h-5 text-amber-400" />
                      Standards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                      <Badge
                        variant="outline"
                        className="text-xs mb-2 bg-amber-500/20 text-amber-300 border-amber-500/40"
                      >
                        NGSS 5-ESS1-1
                      </Badge>
                      <p className="text-sm text-white/90">Sun and solar system objects</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30">
                      <Badge
                        variant="outline"
                        className="text-xs mb-2 bg-orange-500/20 text-orange-300 border-orange-500/40"
                      >
                        NGSS MS-ESS1-2
                      </Badge>
                      <p className="text-sm text-white/90">Solar system scale and properties</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="h-screen w-screen bg-black">
          <SolarSystemEducational />
        </div>
      )}

      {isFullscreen && (
        <Button
          onClick={toggleFullscreen}
          variant="outline"
          size="sm"
          className="fixed bottom-6 right-6 z-50 bg-black/80 backdrop-blur-sm border-purple-500/30 text-white hover:bg-black/90 shadow-[0_0_30px_rgba(139,92,246,0.4)] gap-2"
        >
          <Minimize className="w-4 h-4" />
          Exit Fullscreen
        </Button>
      )}
    </div>
  )
}
