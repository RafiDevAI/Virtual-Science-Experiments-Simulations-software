"use client"

export const dynamic = "force-dynamic"

import { useRef, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Maximize2, Minimize2, Cloud, ThermometerSun, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

// Heat ray particle traveling through atmosphere
interface HeatRay {
  position: THREE.Vector3
  direction: THREE.Vector3
  speed: number
  type: "incoming" | "outgoing" | "trapped"
  age: number
  maxAge: number
}

function createEarthTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext("2d")!

  const oceanGradient = ctx.createRadialGradient(1024, 512, 100, 1024, 512, 1024)
  oceanGradient.addColorStop(0, "#0a5f8a")
  oceanGradient.addColorStop(0.5, "#1e7a9a")
  oceanGradient.addColorStop(1, "#1e3a8a")
  ctx.fillStyle = oceanGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "#2d7016"

  // Africa with more detail
  ctx.beginPath()
  ctx.ellipse(1100, 500, 180, 250, 0, 0, Math.PI * 2)
  ctx.fill()

  // Add lighter shading for terrain variation
  ctx.fillStyle = "#1f4d0f"
  ctx.beginPath()
  ctx.ellipse(1050, 480, 80, 100, 0, 0, Math.PI * 2)
  ctx.fill()

  // Americas with detail
  ctx.fillStyle = "#2d7016"
  ctx.beginPath()
  ctx.ellipse(500, 450, 120, 300, 0, 0, Math.PI * 2)
  ctx.fill()

  // Amazon basin
  ctx.fillStyle = "#1f4d0f"
  ctx.beginPath()
  ctx.ellipse(520, 520, 50, 60, 0, 0, Math.PI * 2)
  ctx.fill()

  // Asia with more detail
  ctx.fillStyle = "#2d7016"
  ctx.beginPath()
  ctx.ellipse(1600, 400, 250, 200, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = "rgba(200, 220, 255, 0.3)"
  ctx.beginPath()
  ctx.ellipse(900, 350, 200, 80, Math.PI / 4, 0, Math.PI * 2)
  ctx.fill()

  const polarGradient = ctx.createLinearGradient(0, 0, 0, 120)
  polarGradient.addColorStop(0, "#ffffff")
  polarGradient.addColorStop(0.7, "rgba(255, 255, 255, 0.5)")
  polarGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
  ctx.fillStyle = polarGradient
  ctx.fillRect(0, 0, canvas.width, 120)

  const polarGradient2 = ctx.createLinearGradient(0, canvas.height - 120, 0, canvas.height)
  polarGradient2.addColorStop(0, "rgba(255, 255, 255, 0)")
  polarGradient2.addColorStop(0.3, "rgba(255, 255, 255, 0.5)")
  polarGradient2.addColorStop(1, "#ffffff")
  ctx.fillStyle = polarGradient2
  ctx.fillRect(0, canvas.height - 120, canvas.width, 120)

  return new THREE.CanvasTexture(canvas)
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)
  const earthTexture = useMemo(() => createEarthTexture(), [])

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002
    }
  })

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={earthTexture} />
    </mesh>
  )
}

function Atmosphere({ hasGreenhouseGases }: { hasGreenhouseGases: boolean }) {
  const atmosphereRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (atmosphereRef.current) {
      const material = atmosphereRef.current.material as THREE.MeshPhongMaterial
      if (hasGreenhouseGases) {
        material.opacity = 0.18 + Math.sin(clock.elapsedTime * 1.5) * 0.08
        material.emissiveIntensity = 0.2 + Math.sin(clock.elapsedTime) * 0.1
      }
    }
  })

  return (
    <>
      {/* Clear atmosphere layer */}
      <mesh>
        <sphereGeometry args={[2.3, 64, 64]} />
        <meshPhongMaterial color="#87CEEB" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>

      {/* Greenhouse gas layer (only visible when enabled) */}
      {hasGreenhouseGases && (
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshPhongMaterial
            color="#ff8844"
            transparent
            opacity={0.18}
            side={THREE.BackSide}
            emissive="#ff6600"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
    </>
  )
}

function HeatRays({ hasGreenhouseGases }: { hasGreenhouseGases: boolean }) {
  const raysRef = useRef<HeatRay[]>([])
  const incomingPointsRef = useRef<THREE.Points>(null)
  const outgoingPointsRef = useRef<THREE.Points>(null)
  const trappedPointsRef = useRef<THREE.Points>(null)

  const maxRays = 150

  useMemo(() => {
    // Initialize rays
    raysRef.current = []
    for (let i = 0; i < maxRays; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 0.6
      const height = (Math.random() - 0.5) * 3

      raysRef.current.push({
        position: new THREE.Vector3(-10, height, (Math.random() - 0.5) * 4),
        direction: new THREE.Vector3(1, 0, 0).normalize(),
        speed: 0.05 + Math.random() * 0.03,
        type: "incoming",
        age: Math.random() * 100,
        maxAge: 200 + Math.random() * 100,
      })
    }
  }, [])

  useFrame(() => {
    const incomingPositions: number[] = []
    const outgoingPositions: number[] = []
    const trappedPositions: number[] = []

    raysRef.current.forEach((ray) => {
      ray.age++
      ray.position.add(ray.direction.clone().multiplyScalar(ray.speed))

      // Incoming sunlight
      if (ray.type === "incoming") {
        if (ray.position.length() < 2.2) {
          // Hit Earth - convert to outgoing or trapped
          const escapeProbability = hasGreenhouseGases ? 0.5 : 0.95

          if (Math.random() > escapeProbability) {
            ray.type = "trapped"
            // Bounce around randomly in atmosphere
            const randomDir = new THREE.Vector3(
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
            ).normalize()
            ray.direction = randomDir
            ray.speed = 0.02
            ray.age = 0
            ray.maxAge = 150 + Math.random() * 150
          } else {
            ray.type = "outgoing"
            ray.direction = ray.position.clone().normalize()
            ray.speed = 0.05
            ray.age = 0
            ray.maxAge = 200
          }
        }
        incomingPositions.push(ray.position.x, ray.position.y, ray.position.z)
      }

      // Outgoing heat (escaping)
      else if (ray.type === "outgoing") {
        if (ray.position.length() > 12 || ray.age > ray.maxAge) {
          // Reset as new incoming ray
          const height = (Math.random() - 0.5) * 3
          ray.position.set(-10, height, (Math.random() - 0.5) * 4)
          ray.direction = new THREE.Vector3(1, 0, 0).normalize()
          ray.type = "incoming"
          ray.speed = 0.05 + Math.random() * 0.03
          ray.age = 0
        }
        outgoingPositions.push(ray.position.x, ray.position.y, ray.position.z)
      }

      // Trapped heat (bouncing in atmosphere)
      else if (ray.type === "trapped") {
        // Keep in atmosphere
        if (ray.position.length() > 2.8) {
          ray.direction.negate()
        }
        if (ray.position.length() < 2.1) {
          ray.direction = ray.position.clone().normalize()
        }

        // Eventually escape or reset
        if (ray.age > ray.maxAge) {
          const height = (Math.random() - 0.5) * 3
          ray.position.set(-10, height, (Math.random() - 0.5) * 4)
          ray.direction = new THREE.Vector3(1, 0, 0).normalize()
          ray.type = "incoming"
          ray.speed = 0.05 + Math.random() * 0.03
          ray.age = 0
        }
        trappedPositions.push(ray.position.x, ray.position.y, ray.position.z)
      }
    })

    // Update geometries
    if (incomingPointsRef.current) {
      const geometry = incomingPointsRef.current.geometry
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(incomingPositions, 3))
      geometry.attributes.position.needsUpdate = true
    }
    if (outgoingPointsRef.current) {
      const geometry = outgoingPointsRef.current.geometry
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(outgoingPositions, 3))
      geometry.attributes.position.needsUpdate = true
    }
    if (trappedPointsRef.current) {
      const geometry = trappedPointsRef.current.geometry
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(trappedPositions, 3))
      geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      {/* Incoming sunlight (yellow) */}
      <points ref={incomingPointsRef}>
        <bufferGeometry />
        <pointsMaterial size={0.08} color="#ffff00" transparent opacity={0.8} sizeAttenuation />
      </points>

      {/* Outgoing heat (orange/red) */}
      <points ref={outgoingPointsRef}>
        <bufferGeometry />
        <pointsMaterial size={0.08} color="#ff6600" transparent opacity={0.8} sizeAttenuation />
      </points>

      {/* Trapped heat (red) */}
      <points ref={trappedPointsRef}>
        <bufferGeometry />
        <pointsMaterial size={0.1} color="#ff0000" transparent opacity={0.9} sizeAttenuation />
      </points>
    </>
  )
}

function Sun3D() {
  const sunRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (sunRef.current) {
      const material = sunRef.current.material as THREE.MeshBasicMaterial
      material.emissiveIntensity = 1.5 + Math.sin(clock.elapsedTime * 2) * 0.3
    }
  })

  return (
    <group position={[-8, 0, 0]}>
      <mesh ref={sunRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#ffff00" emissive="#ffaa00" emissiveIntensity={1.5} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={2} distance={20} color="#ffff88" />

      {/* Sun rays */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * 1.2
        const y = Math.sin(angle) * 1.2
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
            <coneGeometry args={[0.1, 0.5, 3]} />
            <meshBasicMaterial color="#ffff00" transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

function TemperatureDisplay({ hasGreenhouseGases }: { hasGreenhouseGases: boolean }) {
  const temperature = hasGreenhouseGases ? 15 : -18

  return (
    <group position={[0, 3.5, 0]}>
      <Text fontSize={0.4} color={hasGreenhouseGases ? "#ff6600" : "#4488ff"} anchorX="center" anchorY="middle">
        {temperature > 0 ? "+" : ""}
        {temperature}°C
      </Text>
      <Text fontSize={0.2} color="#888888" anchorX="center" anchorY="middle" position={[0, -0.5, 0]}>
        Average Global Temp
      </Text>
    </group>
  )
}

function Scene({ hasGreenhouseGases }: { hasGreenhouseGases: boolean }) {
  return (
    <>
      <color attach="background" args={["#000814"]} />
      <ambientLight intensity={0.3} />
      <Sun3D />
      <Earth />
      <Atmosphere hasGreenhouseGases={hasGreenhouseGases} />
      <HeatRays hasGreenhouseGases={hasGreenhouseGases} />
      <TemperatureDisplay hasGreenhouseGases={hasGreenhouseGases} />
      <OrbitControls enableZoom={true} enablePan={true} minDistance={6} maxDistance={15} target={[0, 0, 0]} />
    </>
  )
}

export default function GreenhouseEffectPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasGreenhouseGases, setHasGreenhouseGases] = useState(true)

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Header */}
      {!isFullscreen && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Link href="/experiments">
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Experiments
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-700" />
              <div>
                <h1 className="text-xl font-bold text-white">Greenhouse Effect</h1>
                <p className="text-sm text-slate-400">
                  {hasGreenhouseGases ? "CO₂ trapping heat in atmosphere" : "Heat escaping to space"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsFullscreen(true)}
              variant="ghost"
              size="sm"
              className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>
      )}

      {/* Fullscreen Exit */}
      {isFullscreen && (
        <Button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 z-20 bg-slate-800/90 hover:bg-slate-700 text-cyan-400 border border-slate-600"
          size="sm"
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Exit Fullscreen
        </Button>
      )}

      {/* Control Panel */}
      <Card className="absolute left-6 top-24 z-10 bg-slate-900/90 backdrop-blur-md border-slate-700 p-6 w-80">
        <CardContent className="p-0 space-y-6">
          {/* Main Control */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Atmosphere Control
            </h3>
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-white">Greenhouse Gases</label>
                  <p className="text-xs text-slate-400">
                    {hasGreenhouseGases ? "CO₂, CH₄, N₂O present" : "Minimal gases"}
                  </p>
                </div>
                <Switch checked={hasGreenhouseGases} onCheckedChange={setHasGreenhouseGases} />
              </div>

              <div className="pt-3 border-t border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <ThermometerSun className="h-4 w-4 text-orange-400" />
                  <span className="text-xs font-medium text-slate-300">Global Temperature</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: hasGreenhouseGases ? "#ff6600" : "#4488ff" }}>
                  {hasGreenhouseGases ? "+15°C" : "-18°C"}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-3">Heat Energy Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-slate-300">Incoming sunlight</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-slate-300">Heat escaping to space</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-300">Heat trapped by gases</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {hasGreenhouseGases && (
            <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-orange-200">
                <span className="font-semibold">Warning:</span> Excess CO₂ causes more heat to be trapped, leading to
                global warming
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Cards */}
      <Card className="absolute right-6 top-24 z-10 bg-slate-900/90 backdrop-blur-md border-slate-700 p-6 w-80 max-h-[calc(100vh-200px)] overflow-y-auto">
        <CardContent className="p-0 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-3">How It Works</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-800/50 rounded p-3">
                <div className="font-semibold text-yellow-400 mb-1">1. Solar Energy Arrives</div>
                <p>Sunlight from the Sun travels through space and enters Earth's atmosphere</p>
              </div>

              <div className="bg-slate-800/50 rounded p-3">
                <div className="font-semibold text-blue-400 mb-1">2. Earth Absorbs & Heats</div>
                <p>Earth's surface absorbs sunlight and converts it to infrared heat energy</p>
              </div>

              <div className="bg-slate-800/50 rounded p-3">
                <div className="font-semibold text-orange-400 mb-1">3. Heat Re-radiates</div>
                <p>The warmed Earth emits infrared radiation (heat) back toward space</p>
              </div>

              <div className="bg-slate-800/50 rounded p-3">
                <div className="font-semibold text-red-400 mb-1">4. Greenhouse Gases Trap Heat</div>
                <p>CO₂ and other gases absorb and re-emit heat, keeping it near Earth</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-sm font-semibold text-cyan-400 mb-3">Key Facts</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Natural greenhouse effect keeps Earth +33°C warmer than it would be</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Without greenhouse gases, Earth would be -18°C on average</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Main greenhouse gases: CO₂, methane (CH₄), water vapor, N₂O</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Burning fossil fuels adds extra CO₂, intensifying the warming effect</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Too much heat trapped causes climate change and global warming</span>
              </li>
            </ul>
          </div>

          {!hasGreenhouseGases && (
            <div className="border-t border-slate-700 pt-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="text-xs text-blue-200">
                  <span className="font-semibold">Without greenhouse gases:</span> Heat escapes freely to space. Earth
                  would be frozen and unable to support most life.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [5, 2, 8], fov: 50 }} className={isFullscreen ? "" : "mt-20"}>
        <Scene hasGreenhouseGases={hasGreenhouseGases} />
      </Canvas>
    </div>
  )
}
