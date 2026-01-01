"use client"

export const dynamic = "force-dynamic"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Play, Pause, Maximize, Minimize } from "lucide-react"
import Link from "next/link"
import * as THREE from "three"

interface Atom {
  element: string
  position: [number, number, number]
  color: string
  size: number
}

interface Bond {
  from: number
  to: number
  type: "single" | "double" | "triple"
}

interface MoleculeData {
  name: string
  formula: string
  description: string
  atoms: Atom[]
  bonds: Bond[]
  geometry: string
}

const molecules: MoleculeData[] = [
  {
    name: "Water",
    formula: "H₂O",
    description: "Water molecule with bent geometry due to lone pairs on oxygen",
    geometry: "Bent (104.5° bond angle)",
    atoms: [
      { element: "O", position: [0, 0, 0], color: "#ff4444", size: 0.8 },
      { element: "H", position: [-0.8, 0.6, 0], color: "#ffffff", size: 0.4 },
      { element: "H", position: [0.8, 0.6, 0], color: "#ffffff", size: 0.4 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
    ],
  },
  {
    name: "Methane",
    formula: "CH₄",
    description: "Methane with tetrahedral geometry - perfect 109.5° bond angles",
    geometry: "Tetrahedral (109.5° bond angles)",
    atoms: [
      { element: "C", position: [0, 0, 0], color: "#444444", size: 0.7 },
      { element: "H", position: [0.6, 0.6, 0.6], color: "#ffffff", size: 0.4 },
      { element: "H", position: [-0.6, -0.6, 0.6], color: "#ffffff", size: 0.4 },
      { element: "H", position: [-0.6, 0.6, -0.6], color: "#ffffff", size: 0.4 },
      { element: "H", position: [0.6, -0.6, -0.6], color: "#ffffff", size: 0.4 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
      { from: 0, to: 4, type: "single" },
    ],
  },
  {
    name: "Ammonia",
    formula: "NH₃",
    description: "Ammonia with trigonal pyramidal shape due to lone pair on nitrogen",
    geometry: "Trigonal Pyramidal (107° bond angles)",
    atoms: [
      { element: "N", position: [0, 0, 0], color: "#4444ff", size: 0.7 },
      { element: "H", position: [0.8, 0.5, 0], color: "#ffffff", size: 0.4 },
      { element: "H", position: [-0.4, 0.5, 0.7], color: "#ffffff", size: 0.4 },
      { element: "H", position: [-0.4, 0.5, -0.7], color: "#ffffff", size: 0.4 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
    ],
  },
  {
    name: "Ethene",
    formula: "C₂H₄",
    description: "Ethene with C=C double bond and planar geometry",
    geometry: "Planar (120° bond angles)",
    atoms: [
      { element: "C", position: [-0.7, 0, 0], color: "#444444", size: 0.7 },
      { element: "C", position: [0.7, 0, 0], color: "#444444", size: 0.7 },
      { element: "H", position: [-1.2, 0.8, 0], color: "#ffffff", size: 0.4 },
      { element: "H", position: [-1.2, -0.8, 0], color: "#ffffff", size: 0.4 },
      { element: "H", position: [1.2, 0.8, 0], color: "#ffffff", size: 0.4 },
      { element: "H", position: [1.2, -0.8, 0], color: "#ffffff", size: 0.4 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
      { from: 1, to: 4, type: "single" },
      { from: 1, to: 5, type: "single" },
    ],
  },
  {
    name: "Carbon Dioxide",
    formula: "CO₂",
    description: "Linear CO₂ molecule with two C=O double bonds",
    geometry: "Linear (180° bond angle)",
    atoms: [
      { element: "C", position: [0, 0, 0], color: "#444444", size: 0.7 },
      { element: "O", position: [-1.2, 0, 0], color: "#ff4444", size: 0.8 },
      { element: "O", position: [1.2, 0, 0], color: "#ff4444", size: 0.8 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "double" },
    ],
  },
]

function Atom({
  position,
  color,
  size,
  element,
  showLabels,
}: {
  position: [number, number, number]
  color: string
  size: number
  element: string
  showLabels: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {showLabels && (
        <Html distanceFactor={10}>
          <div className="bg-white px-2 py-1 rounded shadow text-sm font-medium">{element}</div>
        </Html>
      )}
    </group>
  )
}

function Bond({
  from,
  to,
  atoms,
  type,
}: {
  from: number
  to: number
  atoms: Atom[]
  type: "single" | "double" | "triple"
}) {
  const fromPos = new THREE.Vector3(...atoms[from].position)
  const toPos = new THREE.Vector3(...atoms[to].position)
  const direction = new THREE.Vector3().subVectors(toPos, fromPos)
  const length = direction.length()
  const midpoint = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5)

  const bondCount = type === "single" ? 1 : type === "double" ? 2 : 3
  const bondSpacing = 0.1

  return (
    <group position={midpoint.toArray()}>
      {Array.from({ length: bondCount }, (_, i) => {
        const offset = (i - (bondCount - 1) / 2) * bondSpacing
        const perpendicular = new THREE.Vector3(0, 1, 0).cross(direction).normalize().multiplyScalar(offset)

        return (
          <mesh key={i} position={perpendicular.toArray()}>
            <cylinderGeometry args={[0.05, 0.05, length, 8]} />
            <meshStandardMaterial color="#888888" />
            <primitive
              object={new THREE.Object3D()}
              ref={(ref) => {
                if (ref) {
                  ref.lookAt(toPos)
                  ref.rotateX(Math.PI / 2)
                }
              }}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function MoleculeViewer({
  molecule,
  showLabels,
  isRotating,
}: {
  molecule: MoleculeData
  showLabels: boolean
  isRotating: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      {molecule.atoms.map((atom, index) => (
        <Atom
          key={index}
          position={atom.position}
          color={atom.color}
          size={atom.size}
          element={atom.element}
          showLabels={showLabels}
        />
      ))}
      {molecule.bonds.map((bond, index) => (
        <Bond key={index} from={bond.from} to={bond.to} atoms={molecule.atoms} type={bond.type} />
      ))}
    </group>
  )
}

export default function MolecularStructurePage() {
  const [selectedMolecule, setSelectedMolecule] = useState(molecules[0])
  const [showLabels, setShowLabels] = useState(true)
  const [isRotating, setIsRotating] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  return (
    <div ref={containerRef} className="w-full min-h-screen flex flex-col bg-sky-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/experiments">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Experiments
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">3D Molecular Structure Viewer</h1>
              <p className="text-slate-600 mt-1">Explore molecular geometries and chemical bonding in 3D</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Chemistry
            </Badge>
            <Button onClick={toggleFullscreen} variant="outline" size="sm">
              {isFullscreen ? <Minimize className="w-4 h-4 mr-2" /> : <Maximize className="w-4 h-4 mr-2" />}
              {isFullscreen ? "Exit" : "Fullscreen"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Viewer */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedMolecule.name}</CardTitle>
                  <CardDescription className="text-lg font-mono text-blue-600">
                    {selectedMolecule.formula}
                  </CardDescription>
                  <p className="text-sm text-slate-600 mt-1">{selectedMolecule.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="labels" checked={showLabels} onCheckedChange={setShowLabels} />
                    <label htmlFor="labels" className="text-sm font-medium">
                      Show Labels
                    </label>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsRotating(!isRotating)}>
                    {isRotating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isRotating ? "Pause" : "Rotate"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[500px] p-0">
                <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <pointLight position={[-10, -10, -5]} intensity={0.5} />

                  <MoleculeViewer molecule={selectedMolecule} showLabels={showLabels} isRotating={isRotating} />

                  <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={false} />
                </Canvas>
              </CardContent>
            </Card>

            {/* Molecule Selection */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-sm">⚛</span>
                  </div>
                  Select Molecule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {molecules.map((molecule) => (
                    <Card
                      key={molecule.name}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedMolecule.name === molecule.name
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : "hover:bg-slate-50"
                      }`}
                      onClick={() => setSelectedMolecule(molecule)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{molecule.name}</CardTitle>
                        <CardDescription className="text-lg font-mono text-blue-600">
                          {molecule.formula}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-slate-600">{molecule.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {molecule.geometry}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
