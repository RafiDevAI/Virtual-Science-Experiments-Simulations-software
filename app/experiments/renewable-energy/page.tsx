"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Sun,
  Wind,
  Zap,
  Factory,
  Fuel,
  AlertTriangle,
  Leaf,
  Info,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { ExperimentCompletionButton } from "@/components/experiment-completion-button"
import * as THREE from "three"
import { SidebarNav } from "@/components/sidebar-nav"
import { AppHeader } from "@/components/app-header"

// Enhanced Solar Panel Component
function SolarPanel({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null)
  const [glowIntensity, setGlowIntensity] = useState(0.5)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.25
      setGlowIntensity(0.6 + Math.sin(state.clock.elapsedTime * 2.5) * 0.35)
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Panel base */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 6, 0, 0]}>
        <boxGeometry args={[1.5, 0.05, 1]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Solar cells */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 6, 0, 0]}>
        <boxGeometry args={[1.45, 0.01, 0.95]} />
        <meshStandardMaterial
          color="#1565c0"
          emissive="#0d47a1"
          emissiveIntensity={glowIntensity}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Reflective highlight on solar cells */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 6, 0, 0]}>
        <boxGeometry args={[1.5, 0.01, 1]} />
        <meshStandardMaterial
          color="#1565c0"
          emissive="#0d47a1"
          emissiveIntensity={glowIntensity}
          metalness={0.95}
          roughness={0.08}
        />
      </mesh>
      {/* Support pole */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 16]} />
        <meshStandardMaterial color="#616161" metalness={0.8} />
      </mesh>
      {/* Energy particles rising */}
      <EnergyParticles color="#ffd700" direction="up" count={3} />
      {/* Top reflection highlight */}
      <mesh position={[0, 0.08, -0.4]} rotation={[-Math.PI / 6, 0, 0]}>
        <boxGeometry args={[1.4, 0.005, 0.3]} />
        <meshStandardMaterial
          color="#4dd0e1"
          emissive="#4dd0e1"
          emissiveIntensity={glowIntensity * 0.8}
          transparent
          opacity={glowIntensity * 0.6}
        />
      </mesh>
    </group>
  )
}

// Enhanced Wind Turbine Component
function WindTurbine({ position, speed }: { position: [number, number, number]; speed: number }) {
  const bladesRef = useRef<THREE.Group>(null)
  const towerRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.z += delta * speed * 2.2
    }

    if (towerRef.current) {
      towerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * speed) * 0.01
    }
  })

  return (
    <group position={position}>
      {/* Tower with wobble */}
      <mesh ref={towerRef} position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 1.6, 16]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Nacelle (generator housing) */}
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.2]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.7} />
      </mesh>
      {/* Blades */}
      <group ref={bladesRef} position={[0, 1.7, 0.15]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0, 0]} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <boxGeometry args={[0.05, 0.8, 0.02]} />
            <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
      {/* Energy particles */}
      <EnergyParticles color="#4caf50" direction="up" count={2} />
    </group>
  )
}

// Coal Power Plant Component
function CoalPlant({ position, pollutionLevel }: { position: [number, number, number]; pollutionLevel: number }) {
  return (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <meshStandardMaterial color="#424242" metalness={0.3} roughness={0.8} />
      </mesh>
      {/* Smokestack */}
      <mesh position={[0.4, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.6, 16]} />
        <meshStandardMaterial color="#616161" metalness={0.5} />
      </mesh>
      {/* Pollution smoke */}
      <PollutionParticles count={Math.floor(pollutionLevel * 10)} height={2} />
      {/* Warning light */}
      <mesh position={[-0.5, 0.8, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ff5722" emissive="#ff5722" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}

// Oil Pump Component
function OilPump({ position, active }: { position: [number, number, number]; active: boolean }) {
  const pumpRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (pumpRef.current && active) {
      pumpRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.6, 0.2, 0.6]} />
        <meshStandardMaterial color="#37474f" metalness={0.6} />
      </mesh>
      {/* Pump arm */}
      <group ref={pumpRef} position={[0, 0.2, 0]}>
        <mesh position={[0.3, 0.3, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.6, 0.1, 0.1]} />
          <meshStandardMaterial color="#455a64" metalness={0.7} />
        </mesh>
        {/* Counterweight */}
        <mesh position={[-0.2, 0.2, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#263238" metalness={0.5} />
        </mesh>
      </group>
      {/* Oil barrel */}
      <mesh position={[0.6, 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
      </mesh>
      {/* Pollution */}
      {active && <PollutionParticles count={3} height={0.8} />}
    </group>
  )
}

// Energy Particles (for renewable sources)
function EnergyParticles({ color, direction, count }: { color: string; direction: "up" | "down"; count: number }) {
  const particlesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        const offset = (state.clock.elapsedTime + i) % 2
        particle.position.y = direction === "up" ? offset * 1.5 : -offset * 1.5
        const scale = 1 - Math.abs(offset - 1) * 0.5
        particle.scale.setScalar(scale)
      })
    }
  })

  return (
    <group ref={particlesRef}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[0, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// Enhanced Pollution Particles (for non-renewable sources)
function PollutionParticles({ count, height }: { count: number; height: number }) {
  const particlesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        const offset = (state.clock.elapsedTime * 0.6 + i * 0.4) % 2.5
        particle.position.y = height + offset * 2
        particle.position.x = Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.3
        particle.position.z = Math.cos(state.clock.elapsedTime * 0.6 + i) * 0.2

        const opacity = Math.max(0, 0.85 - (offset / 2.5) * 0.7)
        ;(particle as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? "#505050" : "#707070",
          transparent: true,
          opacity,
          emissive: "#303030",
        })
      })
    }
  })

  return (
    <group ref={particlesRef}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[0, height, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#505050" transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

// Main 3D Scene
function EnergyComparisonScene({
  turbineSpeed,
  pollutionLevel,
  fuelLevel,
}: {
  turbineSpeed: number
  pollutionLevel: number
  fuelLevel: number
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3, 8]} />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={12} maxPolarAngle={Math.PI / 2.5} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} />
      <hemisphereLight args={["#87ceeb", "#8b7355", 0.6]} />

      {/* Sun */}
      <mesh position={[8, 8, -5]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>

      {/* Ground */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#7cb342" />
      </mesh>

      {/* Dividing line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* LEFT SIDE - RENEWABLE ENERGY (Green/Clean) */}
      <group position={[-3, 0, 0]}>
        <SolarPanel position={[0, 0, 1]} />
        <SolarPanel position={[1, 0, -0.5]} />
        <WindTurbine position={[-1.2, 0, 0]} speed={turbineSpeed} />
        <WindTurbine position={[-1.2, 0, -2]} speed={turbineSpeed * 0.8} />

        {/* Clean sky on left */}
        <mesh position={[0, 4, -3]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* RIGHT SIDE - NON-RENEWABLE ENERGY (Gray/Polluted) */}
      <group position={[3, 0, 0]}>
        <CoalPlant position={[0, 0, 0]} pollutionLevel={pollutionLevel} />
        <OilPump position={[1.5, 0, -1]} active={fuelLevel > 0.2} />

        {/* Polluted sky on right */}
        {pollutionLevel > 0.5 && (
          <mesh position={[0, 5, -2]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial color="#9e9e9e" transparent opacity={0.3} />
          </mesh>
        )}
      </group>

      {/* Labels */}
      <mesh position={[-3, 2.5, 2]}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial color="#4caf50" transparent opacity={0.9} />
      </mesh>
      <mesh position={[3, 2.5, 2]}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial color="#f44336" transparent opacity={0.9} />
      </mesh>
    </>
  )
}

export default function RenewableEnergyPage() {
  const [turbineSpeed, setTurbineSpeed] = useState(1)
  const [pollutionLevel, setPollutionLevel] = useState(0.7)
  const [fuelLevel, setFuelLevel] = useState(1)

  // Simulate fuel depletion for non-renewable
  const depleteFuel = () => {
    if (fuelLevel > 0) {
      setFuelLevel(Math.max(0, fuelLevel - 0.1))
    }
  }

  const resetFuel = () => setFuelLevel(1)

  // Calculate sustainability score
  const sustainabilityScore =
    Math.round(((1 - pollutionLevel) * 50 + (fuelLevel > 0.5 ? 0 : 25) + turbineSpeed * 25) * 100) / 100

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col">
        <AppHeader />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Link href="/experiments">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Experiments
                    </Button>
                  </Link>
                  <div className="h-8 w-px bg-border" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Renewable vs Non-renewable Energy</h1>
                      <p className="text-sm text-muted-foreground">Energy Sources Comparison</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Physics</Badge>
                  <Badge variant="outline">3D Comparison</Badge>
                  <ExperimentCompletionButton experimentId="renewable-energy" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main 3D View */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="overflow-hidden">
                  <div className="h-[600px] bg-gradient-to-br from-sky-50 to-green-50 dark:from-sky-950/20 dark:to-green-950/20">
                    <Canvas shadows>
                      <EnergyComparisonScene
                        turbineSpeed={turbineSpeed}
                        pollutionLevel={pollutionLevel}
                        fuelLevel={fuelLevel}
                      />
                    </Canvas>
                  </div>
                </Card>

                {/* Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      Energy Comparison Controls
                    </CardTitle>
                    <CardDescription>Adjust parameters to compare energy sources</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Wind Speed Control */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Wind className="w-4 h-4 text-green-500" />
                          Wind Turbine Speed
                        </label>
                        <span className="text-sm text-muted-foreground">{(turbineSpeed * 100).toFixed(0)}%</span>
                      </div>
                      <Slider
                        value={[turbineSpeed]}
                        onValueChange={(value) => setTurbineSpeed(value[0])}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">Renewable energy increases with wind speed</p>
                    </div>

                    {/* Pollution Level Control */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Factory className="w-4 h-4 text-red-500" />
                          Pollution Level (Non-renewable)
                        </label>
                        <span className="text-sm text-muted-foreground">{(pollutionLevel * 100).toFixed(0)}%</span>
                      </div>
                      <Slider
                        value={[pollutionLevel]}
                        onValueChange={(value) => setPollutionLevel(value[0])}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Fossil fuels release CO₂ and pollutants into the air
                      </p>
                    </div>

                    {/* Fuel Depletion */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Fuel className="w-4 h-4 text-orange-500" />
                          Fuel Remaining (Non-renewable)
                        </label>
                        <span className="text-sm text-muted-foreground">{(fuelLevel * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={fuelLevel * 100} className="h-3" />
                      <div className="flex gap-2">
                        <Button
                          onClick={depleteFuel}
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 bg-transparent"
                        >
                          <TrendingDown className="w-4 h-4" />
                          Use Fuel
                        </Button>
                        <Button onClick={resetFuel} variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                          <TrendingUp className="w-4 h-4" />
                          Reset
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {fuelLevel > 0
                          ? "Fossil fuels will eventually run out"
                          : "No fuel remaining - energy production stopped!"}
                      </p>
                    </div>

                    {/* Sustainability Score */}
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Sustainability</span>
                        <span className="text-2xl font-bold text-primary">{sustainabilityScore}%</span>
                      </div>
                      <Progress value={sustainabilityScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Renewable Energy */}
                <Card className="border-green-500/40 bg-green-500/5">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-500" />
                      <CardTitle className="text-lg">Renewable Energy</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="w-4 h-4 text-yellow-500" />
                        <h4 className="font-semibold">Solar Power</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Converts sunlight to electricity. Clean, silent, and infinite source.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-4 h-4 text-blue-500" />
                        <h4 className="font-semibold">Wind Power</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Turbines capture wind energy. No emissions, renewable forever.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-green-600/10 border border-green-600/30 mt-3">
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Benefits:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>✓ Never runs out</li>
                        <li>✓ Zero pollution</li>
                        <li>✓ Sustainable forever</li>
                        <li>✓ Low maintenance costs</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Non-Renewable Energy */}
                <Card className="border-red-500/40 bg-red-500/5">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <CardTitle className="text-lg">Non-renewable Energy</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Factory className="w-4 h-4 text-gray-500" />
                        <h4 className="font-semibold">Coal Power</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Burns coal for electricity. Heavy pollution and limited supply.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Fuel className="w-4 h-4 text-orange-500" />
                        <h4 className="font-semibold">Oil/Gas</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Extracted from underground. Will run out and pollutes air.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-red-600/10 border border-red-600/30 mt-3">
                      <h4 className="font-semibold text-red-700 dark:text-red-300 mb-1">Problems:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>✗ Will eventually run out</li>
                        <li>✗ Heavy air pollution (CO₂)</li>
                        <li>✗ Causes climate change</li>
                        <li>✗ Not sustainable</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* How It Works */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">Key Concept</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>Renewable energy</strong> comes from natural sources like the sun and wind that never run
                      out. They produce clean energy with zero pollution.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>Non-renewable energy</strong> comes from fossil fuels (coal, oil, gas) formed millions of
                      years ago. Once used, they're gone forever and release harmful CO₂.
                    </p>
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-muted-foreground">
                        <strong>The future is renewable!</strong> We must transition to clean energy to protect our
                        planet and combat climate change.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
export const revalidate = 0
