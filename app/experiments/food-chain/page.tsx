"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Check, RotateCcw, Lightbulb, ArrowLeft, Maximize, Minimize } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const CIRCLE_SIZE = 112 // 28 * 4 = 112px (w-28 h-28)
const MIN_ARROWS_REQUIRED = 4

const FoodChainBuilder = () => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [placedAnimals, setPlacedAnimals] = useState({})
  const [arrows, setArrows] = useState([])
  const [drawingArrow, setDrawingArrow] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const containerRef = useRef(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Multiple levels - Forest and Marine Ecosystem
  const levels = useMemo(
    () => [
      {
        name: "FOREST ECOSYSTEM",
        background: "linear-gradient(to bottom, #87CEEB 0%, #98D8C8 25%, #6B8E23 50%, #4A7023 100%)",
        positions: [
          { id: "pos1", x: 20, y: 70, label: "Producer", correctAnimal: "flower", name: "Flower" },
          { id: "pos2", x: 25, y: 55, label: "Primary Consumer", correctAnimal: "caterpillar", name: "Caterpillar" },
          { id: "pos3", x: 50, y: 75, label: "Secondary Consumer", correctAnimal: "frog", name: "Frog" },
          { id: "pos4", x: 75, y: 65, label: "Tertiary Consumer", correctAnimal: "snake", name: "Snake" },
          { id: "pos5", x: 82, y: 28, label: "Top Consumer", correctAnimal: "owl", name: "Owl" },
        ],
        animals: [
          { id: "flower", name: "Flower", emoji: "🌼", color: "bg-pink-400" },
          { id: "caterpillar", name: "Caterpillar", emoji: "🐛", color: "bg-yellow-500" },
          { id: "frog", name: "Frog", emoji: "🐸", color: "bg-green-500" },
          { id: "snake", name: "Snake", emoji: "🐍", color: "bg-green-700" },
          { id: "owl", name: "Owl", emoji: "🦉", color: "bg-gray-600" },
          { id: "rabbit", name: "Rabbit", emoji: "🐰", color: "bg-gray-400" },
          { id: "mouse", name: "Mouse", emoji: "🐭", color: "bg-gray-500" },
        ],
      },
      {
        name: "MARINE ECOSYSTEM",
        background: "linear-gradient(to bottom, #1e3a8a 0%, #1e40af 20%, #2563eb 40%, #3b82f6 70%, #93c5fd 100%)",
        positions: [
          { id: "pos1", x: 18, y: 82, label: "Producer", correctAnimal: "seaweed", name: "Seaweed" },
          { id: "pos2", x: 35, y: 75, label: "Primary Consumer", correctAnimal: "zooplankton", name: "Zooplankton" },
          { id: "pos3", x: 50, y: 65, label: "Secondary Consumer", correctAnimal: "fish", name: "Small Fish" },
          { id: "pos4", x: 70, y: 55, label: "Tertiary Consumer", correctAnimal: "squid", name: "Squid" },
          { id: "pos5", x: 80, y: 35, label: "Top Predator", correctAnimal: "dolphin", name: "Dolphin" },
        ],
        animals: [
          { id: "seaweed", name: "Seaweed", emoji: "🌿", color: "bg-green-600" },
          { id: "zooplankton", name: "Zooplankton", emoji: "🦐", color: "bg-pink-400" },
          { id: "fish", name: "Small Fish", emoji: "🐟", color: "bg-blue-400" },
          { id: "squid", name: "Squid", emoji: "🦑", color: "bg-purple-500" },
          { id: "dolphin", name: "Dolphin", emoji: "🐬", color: "bg-blue-600" },
          { id: "crab", name: "Crab", emoji: "🦀", color: "bg-red-500" },
          { id: "shark", name: "Shark", emoji: "🦈", color: "bg-gray-600" },
        ],
      },
    ],
    [],
  )

  const currentLevelData = levels[currentLevel]
  const animalPositions = currentLevelData.positions
  const animals = currentLevelData.animals

  const handleDragStart = useCallback((e, animal) => {
    e.dataTransfer.setData("animal", JSON.stringify(animal))
  }, [])

  const handleDrop = useCallback((e, positionId) => {
    e.preventDefault()
    const animal = JSON.parse(e.dataTransfer.getData("animal"))
    setPlacedAnimals((prev) => ({ ...prev, [positionId]: animal }))
    setShowFeedback(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  const removeAnimal = useCallback((positionId) => {
    setPlacedAnimals((prev) => {
      const newPlaced = { ...prev }
      delete newPlaced[positionId]
      return newPlaced
    })
  }, [])

  const startArrow = useCallback(
    (positionId) => {
      const placed = placedAnimals[positionId]
      if (!placed) return

      if (drawingArrow) {
        const newArrow = [drawingArrow, positionId]
        if (drawingArrow !== positionId) {
          setArrows((prev) => [...prev, newArrow])
        }
        setDrawingArrow(null)
      } else {
        setDrawingArrow(positionId)
      }
    },
    [drawingArrow, placedAnimals],
  )

  const removeArrow = useCallback((index) => {
    setArrows((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const checkAnswer = useCallback(() => {
    const allPositionsFilled = animalPositions.every((pos) => placedAnimals[pos.id])

    if (!allPositionsFilled) {
      alert("Please place all animals in the circles first!")
      return
    }

    const animalsCorrect = animalPositions.every((pos) => placedAnimals[pos.id]?.id === pos.correctAnimal)

    const hasEnoughArrows = arrows.length >= MIN_ARROWS_REQUIRED
    const correct = animalsCorrect && hasEnoughArrows
    setIsCorrect(correct)
    setShowFeedback(true)
  }, [animalPositions, placedAnimals, arrows.length])

  const reset = useCallback(() => {
    setPlacedAnimals({})
    setArrows([])
    setDrawingArrow(null)
    setShowFeedback(false)
    setShowHint(false)
  }, [])

  const nextLevel = useCallback(() => {
    setCurrentLevel((prev) => (prev + 1) % levels.length)
    reset()
  }, [levels.length, reset])

  const getPositionCoordinates = useCallback(
    (posId) => {
      const pos = animalPositions.find((p) => p.id === posId)
      return pos ? { x: pos.x, y: pos.y } : null
    },
    [animalPositions],
  )

  return (
    <div className="w-full min-h-screen flex flex-col bg-sky-200">
      {/* Header with Level Selector */}
      <div className="bg-gradient-to-r from-blue-700 to-green-600 text-white p-2 md:p-3 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
          <h1
            className="text-2xl md:text-4xl font-bold text-center"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            {currentLevelData.name}
          </h1>

          {/* Level Selector Buttons */}
          <div className="flex gap-2 md:gap-3">
            {levels.map((level, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentLevel(index)
                  reset()
                }}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all text-sm md:text-base ${
                  currentLevel === index
                    ? "bg-yellow-400 text-gray-900 scale-110 shadow-lg"
                    : "bg-white bg-opacity-20 hover:bg-opacity-30"
                }`}
                aria-label={`Switch to ${index === 0 ? "Forest" : "Marine"} ecosystem`}
              >
                {index === 0 ? "🌳 Forest" : "🌊 Marine"}
              </button>
            ))}
          </div>
        </div>
        <p className="text-center text-xs md:text-sm mt-1 md:mt-2">
          Drag animals to circles • Click circles to draw arrows
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Scene - Changes based on level */}
        <div ref={containerRef} className="flex-1 relative overflow-hidden min-h-[400px] md:min-h-0">
          {/* Background */}
          <div className="absolute inset-0" style={{ background: currentLevelData.background }}>
            {/* FOREST ECOSYSTEM SCENE */}
            {currentLevel === 0 && (
              <>
                {/* Sky with gradient */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-sky-400 via-sky-300 to-transparent" />

                {/* Sun rays */}
                <div className="absolute top-4 md:top-8 right-8 md:right-16 w-16 h-16 md:w-24 md:h-24 bg-yellow-300 rounded-full opacity-80 blur-sm" />
                <div className="absolute top-6 md:top-12 right-10 md:right-20 text-5xl md:text-7xl">☀️</div>

                {/* Clouds with animation */}
                <div className="absolute top-8 md:top-16 left-12 md:left-24 text-4xl md:text-6xl opacity-70 animate-pulse">
                  ☁️
                </div>
                <div className="absolute top-12 md:top-20 right-32 md:right-48 text-3xl md:text-5xl opacity-60">☁️</div>
                <div className="absolute top-6 md:top-10 left-1/2 text-3xl md:text-5xl opacity-50">☁️</div>

                {/* Distant mountains silhouette */}
                <div
                  className="absolute bottom-1/3 left-0 w-full h-32 md:h-48"
                  style={{
                    background: "linear-gradient(to top, transparent, rgba(45,80,22,0.2))",
                    clipPath: "polygon(0 100%, 20% 60%, 40% 80%, 60% 50%, 80% 70%, 100% 60%, 100% 100%)",
                  }}
                />

                {/* Far background trees - multiple layers */}
                <div
                  className="absolute top-16 md:top-24 left-3 md:left-8 text-6xl md:text-9xl opacity-20"
                  style={{ color: "#1a3d0f" }}
                >
                  🌲
                </div>
                <div
                  className="absolute top-12 md:top-20 left-20 md:left-40 text-7xl md:text-9xl opacity-20"
                  style={{ color: "#1a3d0f" }}
                >
                  🌳
                </div>
                <div
                  className="absolute top-20 md:top-28 right-16 md:right-32 text-6xl md:text-8xl opacity-20"
                  style={{ color: "#1a3d0f" }}
                >
                  🌲
                </div>
                <div
                  className="absolute top-14 md:top-22 right-32 md:right-56 text-7xl md:text-9xl opacity-20"
                  style={{ color: "#1a3d0f" }}
                >
                  🌳
                </div>

                {/* Mid-layer trees */}
                <div
                  className="absolute top-8 md:top-16 left-12 md:left-24 text-7xl md:text-9xl opacity-40"
                  style={{ color: "#2d5016" }}
                >
                  🌳
                </div>
                <div
                  className="absolute top-10 md:top-20 right-12 md:right-24 text-7xl md:text-9xl opacity-40"
                  style={{ color: "#2d5016" }}
                >
                  🌲
                </div>
                <div
                  className="absolute top-16 md:top-28 left-1/3 text-6xl md:text-8xl opacity-35"
                  style={{ color: "#2d5016" }}
                >
                  🌳
                </div>
                <div
                  className="absolute top-14 md:top-26 right-1/3 text-6xl md:text-8xl opacity-35"
                  style={{ color: "#2d5016" }}
                >
                  🌲
                </div>

                {/* Large foreground trees with depth */}
                <div
                  className="absolute -top-4 md:top-0 -left-4 md:left-0 opacity-60 text-8xl md:text-9xl"
                  style={{ fontSize: "clamp(8rem, 15vw, 14rem)", color: "#3d6b1f" }}
                >
                  🌳
                </div>
                <div
                  className="absolute -top-4 md:top-0 -right-4 md:right-0 opacity-60 text-8xl md:text-9xl"
                  style={{ fontSize: "clamp(8rem, 15vw, 14rem)", color: "#3d6b1f" }}
                >
                  🌲
                </div>

                {/* Massive foreground tree right */}
                <div
                  className="absolute top-0 right-8 md:right-16 opacity-70 text-9xl"
                  style={{ fontSize: "clamp(10rem, 20vw, 16rem)", color: "#4a7023" }}
                >
                  🌳
                </div>

                {/* Vines hanging */}
                <div
                  className="absolute top-0 left-1/4 text-4xl md:text-6xl opacity-60"
                  style={{ transform: "scaleY(1.5)" }}
                >
                  🍃
                </div>
                <div
                  className="absolute top-0 right-1/3 text-3xl md:text-5xl opacity-50"
                  style={{ transform: "scaleY(1.5)" }}
                >
                  🌿
                </div>

                {/* Ground vegetation layer with gradient */}
                <div className="absolute bottom-0 left-0 w-full h-40 md:h-56 bg-gradient-to-t from-green-900 via-green-700 to-transparent" />

                {/* Dense grass on ground */}
                <div className="absolute bottom-6 md:bottom-10 left-4 md:left-8 text-5xl md:text-7xl">🌿</div>
                <div className="absolute bottom-4 md:bottom-8 left-16 md:left-28 text-4xl md:text-6xl">🌾</div>
                <div className="absolute bottom-8 md:bottom-12 left-28 md:left-48 text-3xl md:text-5xl">🍀</div>
                <div className="absolute bottom-10 md:bottom-16 right-40 md:right-64 text-4xl md:text-6xl">🌿</div>
                <div className="absolute bottom-6 md:bottom-10 right-20 md:right-32 text-5xl md:text-7xl">🌾</div>
                <div className="absolute bottom-4 md:bottom-8 right-8 md:right-16 text-4xl md:text-6xl">🌿</div>
                <div className="absolute bottom-7 md:bottom-11 left-1/2 text-4xl md:text-6xl">🌱</div>

                {/* Bushes */}
                <div className="absolute bottom-12 md:bottom-20 left-1/4 text-5xl md:text-7xl opacity-80">🌳</div>
                <div className="absolute bottom-14 md:bottom-22 right-1/4 text-4xl md:text-6xl opacity-70">🌳</div>

                {/* Rocks scattered */}
                <div className="absolute bottom-16 md:bottom-24 left-1/3 text-3xl md:text-5xl">🪨</div>
                <div className="absolute bottom-12 md:bottom-20 right-1/4 text-4xl md:text-6xl">🪨</div>
                <div className="absolute bottom-14 md:bottom-22 right-1/3 text-2xl md:text-4xl">🪨</div>

                {/* Beautiful flower patches */}
                <div className="absolute" style={{ bottom: "18%", left: "16%", fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                  🌼
                </div>
                <div className="absolute" style={{ bottom: "20%", left: "20%", fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
                  🌼
                </div>
                <div className="absolute" style={{ bottom: "16%", left: "14%", fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
                  🌸
                </div>
                <div
                  className="absolute"
                  style={{ bottom: "22%", left: "18%", fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                >
                  🌺
                </div>

                {/* Mushrooms */}
                <div className="absolute bottom-20 md:bottom-32 right-1/3 text-xl md:text-3xl">🍄</div>
                <div className="absolute bottom-16 md:bottom-28 left-2/3 text-2xl md:text-4xl">🍄</div>
                <div className="absolute bottom-18 md:bottom-30 left-1/2 text-xl md:text-2xl">🍄</div>

                {/* Butterflies flying */}
                <div className="absolute bottom-28 md:bottom-40 left-1/2 text-2xl md:text-3xl opacity-70 animate-pulse">
                  🦋
                </div>
                <div className="absolute bottom-32 md:bottom-44 right-1/3 text-xl md:text-2xl opacity-60">🦋</div>

                {/* Soil layer at bottom with texture */}
                <div className="absolute bottom-0 left-0 w-full h-12 md:h-20 bg-gradient-to-t from-amber-900 via-amber-800 to-green-900 opacity-90" />
                <div
                  className="absolute bottom-0 left-0 w-full h-8 md:h-14"
                  style={{
                    background: "repeating-linear-gradient(90deg, #654321 0px, #8B4513 15px, #654321 30px)",
                    clipPath: "polygon(0 30%, 100% 30%, 100% 100%, 0 100%)",
                  }}
                />
              </>
            )}

            {/* MARINE ECOSYSTEM SCENE */}
            {currentLevel === 1 && (
              <>
                {/* Sun */}
                <div className="absolute top-4 md:top-8 right-8 md:right-16 text-6xl md:text-8xl">☀️</div>

                {/* Clouds */}
                <div className="absolute top-4 left-12 md:left-20 text-4xl md:text-6xl opacity-80">☁️</div>
                <div className="absolute top-8 md:top-12 right-24 md:right-40 text-3xl md:text-5xl opacity-70">☁️</div>

                {/* Waves at surface */}
                <div
                  className="absolute top-16 md:top-24 left-0 w-full h-16 md:h-20"
                  style={{
                    background:
                      "repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.3) 50px, transparent 100px)",
                  }}
                />

                {/* Boat on surface */}
                <div className="absolute top-12 md:top-20 right-20 md:right-32 text-5xl md:text-7xl">🚢</div>

                {/* Seabirds */}
                <div className="absolute top-10 md:top-16 left-1/3 text-2xl md:text-3xl">🕊️</div>
                <div className="absolute top-12 md:top-20 left-1/2 text-2xl md:text-3xl">🕊️</div>

                {/* Water layers with depth */}
                <div className="absolute top-24 md:top-32 left-0 w-full h-1/4 bg-gradient-to-b from-blue-300/30 to-transparent" />
                <div className="absolute top-32 md:top-48 left-0 w-full h-1/3 bg-gradient-to-b from-blue-500/20 to-transparent" />

                {/* Ocean floor */}
                <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-yellow-800 to-blue-900" />

                {/* Seaweed and corals on floor */}
                <div className="absolute" style={{ bottom: "8%", left: "12%", fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                  🪸
                </div>
                <div className="absolute" style={{ bottom: "12%", left: "20%", fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                  🌊
                </div>

                {/* Rocks and shells on floor */}
                <div className="absolute bottom-6 md:bottom-8 left-20 md:left-32 text-3xl md:text-4xl">🪨</div>
                <div className="absolute bottom-4 md:bottom-6 left-32 md:left-48 text-2xl md:text-3xl">🐚</div>
                <div className="absolute bottom-8 md:bottom-10 right-28 md:right-40 text-3xl md:text-4xl">🪨</div>
                <div className="absolute bottom-6 md:bottom-8 right-36 md:right-56 text-2xl md:text-3xl">🐚</div>

                {/* Coral reef */}
                <div className="absolute bottom-10 md:bottom-12 right-12 md:right-16 text-4xl md:text-6xl">🪸</div>
                <div className="absolute bottom-8 md:bottom-10 right-16 md:right-24 text-3xl md:text-5xl">🪸</div>

                {/* Crabs on floor */}
                <div className="absolute bottom-12 md:bottom-16 left-1/3 text-3xl md:text-4xl">🦀</div>
                <div className="absolute bottom-10 md:bottom-14 right-1/3 text-2xl md:text-3xl">🦀</div>

                {/* Starfish */}
                <div className="absolute bottom-14 md:bottom-20 left-2/3 text-2xl md:text-3xl">⭐</div>

                {/* Additional fish swimming - background decoration only */}
                <div className="absolute top-1/3 left-1/4 text-2xl md:text-3xl opacity-70">🐠</div>
                <div className="absolute top-2/5 right-1/4 text-2xl md:text-3xl opacity-70">🐡</div>

                {/* Bubbles */}
                <div className="absolute top-1/2 left-1/3 text-xl md:text-2xl opacity-60">💧</div>
                <div className="absolute top-2/3 right-1/3 text-xl md:text-2xl opacity-60">💧</div>
                <div className="absolute top-3/4 left-1/2 text-lg md:text-xl opacity-50">💧</div>
              </>
            )}
          </div>

          {/* Interactive Drop Circles */}
          {animalPositions.map((position) => {
            const placed = placedAnimals[position.id]
            const isDrawingFrom = drawingArrow === position.id

            return (
              <div
                key={position.id}
                className="absolute z-10"
                style={{ left: `${position.x}%`, top: `${position.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <div
                  onDrop={(e) => handleDrop(e, position.id)}
                  onDragOver={handleDragOver}
                  onClick={() => startArrow(position.id)}
                  className={`w-20 h-20 md:w-28 md:h-28 rounded-full border-4 flex flex-col items-center justify-center cursor-pointer transition-all shadow-2xl ${
                    placed
                      ? `${placed.color} border-white scale-110`
                      : "border-dashed border-white bg-white bg-opacity-60 hover:bg-opacity-90"
                  } ${isDrawingFrom ? "ring-4 ring-yellow-400 animate-pulse" : ""}`}
                  role="button"
                  aria-label={placed ? `${placed.name} placed in ${position.label}` : `Drop zone for ${position.label}`}
                  tabIndex={0}
                >
                  {placed ? (
                    <div className="text-center relative group">
                      <div className="text-3xl md:text-5xl">{placed.emoji}</div>
                      <div className="text-xs font-bold text-white mt-1 px-1">{placed.name}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeAnimal(position.id)
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 hidden group-hover:flex items-center justify-center shadow-lg text-xs"
                        aria-label={`Remove ${placed.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="text-center px-2">
                      <div className="text-2xl md:text-4xl mb-1">⭕</div>
                      <div className="text-xs text-gray-800 font-bold leading-tight">{position.label}</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          <svg className="absolute inset-0 w-full h-full pointer-events-none z-5" aria-hidden="true">
            <defs>
              <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 12 3.5, 0 7" fill="white" stroke="#000" strokeWidth="1" />
              </marker>
            </defs>
            {arrows.map((arrow, index) => {
              const start = getPositionCoordinates(arrow[0])
              const end = getPositionCoordinates(arrow[1])
              if (!start || !end) return null

              const startX = (start.x / 100) * containerSize.width
              const startY = (start.y / 100) * containerSize.height
              const endX = (end.x / 100) * containerSize.width
              const endY = (end.y / 100) * containerSize.height

              return (
                <g key={index}>
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="white"
                    strokeWidth="6"
                    markerEnd="url(#arrowhead)"
                    style={{
                      filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.7))",
                      strokeDasharray: "10,5",
                    }}
                  />
                  <circle
                    cx={(startX + endX) / 2}
                    cy={(startY + endY) / 2}
                    r="16"
                    fill="#EF4444"
                    stroke="white"
                    strokeWidth="3"
                    className="cursor-pointer hover:scale-110 transition-transform"
                    style={{ pointerEvents: "all" }}
                    onClick={() => removeArrow(index)}
                  />
                  <text
                    x={(startX + endX) / 2}
                    y={(startY + endY) / 2 + 2}
                    textAnchor="middle"
                    fill="white"
                    fontSize="18"
                    fontWeight="bold"
                    style={{ pointerEvents: "none" }}
                  >
                    ✕
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Instructions */}
          {drawingArrow && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 px-4 md:px-8 py-2 md:py-4 rounded-full shadow-2xl animate-bounce z-20 font-bold text-sm md:text-lg border-2 md:border-4 border-yellow-300">
              ➡️ Click another filled circle to complete the arrow! ➡️
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30 p-4">
              <div
                className={`p-6 md:p-12 rounded-3xl shadow-2xl ${
                  isCorrect ? "bg-green-600" : "bg-red-600"
                } text-white text-center max-w-lg animate-bounce border-4 md:border-8 border-white`}
              >
                <div className="text-5xl md:text-8xl mb-4 md:mb-6">{isCorrect ? "🎉" : "😕"}</div>
                <h2 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">
                  {isCorrect ? "Excellent!" : "Try Again!"}
                </h2>
                <p className="text-lg md:text-2xl mb-4 md:mb-6">
                  {isCorrect ? "You built the food chain perfectly!" : "Check the animals and arrows!"}
                </p>
                {isCorrect && currentLevel < levels.length - 1 && (
                  <button
                    onClick={nextLevel}
                    className="bg-yellow-400 text-gray-900 px-6 md:px-8 py-2 md:py-3 rounded-full font-bold hover:bg-yellow-300 text-lg md:text-xl shadow-lg mr-2 md:mr-4"
                  >
                    Next Level →
                  </button>
                )}
                {isCorrect && currentLevel === levels.length - 1 && (
                  <p className="text-base md:text-xl bg-yellow-400 text-gray-900 px-4 md:px-6 py-2 rounded-full font-bold inline-block mb-4">
                    🎉 You completed all levels! 🎉
                  </p>
                )}
                <button
                  onClick={() => setShowFeedback(false)}
                  className="bg-white text-gray-900 px-6 md:px-8 py-2 md:py-3 rounded-full font-bold hover:bg-gray-100 text-lg md:text-xl shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-80 bg-gradient-to-b from-green-800 via-green-700 to-green-900 p-4 md:p-5 overflow-y-auto shadow-2xl">
          <h3 className="text-white text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center border-b-4 border-white pb-2 md:pb-3">
            🌿 ANIMAL CARDS 🌿
          </h3>

          <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
            {animals.map((animal) => (
              <div
                key={animal.id}
                draggable
                onDragStart={(e) => handleDragStart(e, animal)}
                className={`${animal.color} p-3 md:p-4 rounded-xl cursor-move hover:scale-105 active:scale-95 transition-transform shadow-xl border-2 md:border-3 border-white`}
                role="button"
                aria-label={`Drag ${animal.name} to place in food chain`}
                tabIndex={0}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-4xl md:text-6xl">{animal.emoji}</div>
                  <div className="text-white font-bold text-lg md:text-xl">{animal.name}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Hint */}
          {showHint && (
            <div className="bg-yellow-100 p-4 md:p-5 rounded-xl mb-3 md:mb-4 border-2 md:border-4 border-yellow-400 shadow-lg">
              <p className="text-xs md:text-sm text-gray-900 font-semibold leading-relaxed">
                <span className="text-xl md:text-2xl">💡</span> <strong>Hint:</strong>
                <br />
                {currentLevel === 0
                  ? "Energy flows from producers (flowers) → herbivores (caterpillar) → carnivores (frog, snake) → top predator (owl). Arrows show who eats whom!"
                  : "Ocean energy flows: Seaweed/Plankton (producers) → Zooplankton → Small fish → Squid → Dolphins. Remember: arrows point from food to the eater!"}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-2 md:space-y-3">
            <button
              onClick={checkAnswer}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-3 md:py-4 rounded-xl font-bold flex items-center justify-center gap-2 md:gap-3 transition-all shadow-xl text-base md:text-lg border-2 border-blue-400"
              aria-label="Check if your food chain is correct"
            >
              <Check size={24} /> Check Answer
            </button>
            <button
              onClick={reset}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 md:px-5 py-3 md:py-4 rounded-xl font-bold flex items-center justify-center gap-2 md:gap-3 transition-all shadow-xl text-base md:text-lg border-2 border-orange-400"
              aria-label="Reset and start over"
            >
              <RotateCcw size={24} /> Start Over
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 md:px-5 py-3 md:py-4 rounded-xl font-bold flex items-center justify-center gap-2 md:gap-3 transition-all shadow-xl text-base md:text-lg border-2 border-yellow-300"
              aria-label={showHint ? "Hide hint" : "Show hint"}
            >
              <Lightbulb size={24} /> {showHint ? "Hide" : "Show"} Hint
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FoodChainPage() {
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
    <div className="min-h-screen bg-background">
      {!isFullscreen && (
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/experiments">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Experiments
                </Button>
              </Link>
              <Button onClick={toggleFullscreen} variant="outline" size="sm">
                <Maximize className="w-4 h-4 mr-2" />
                Fullscreen
              </Button>
            </div>
          </div>
        </header>
      )}

      <div ref={containerRef} className={isFullscreen ? "h-screen" : ""}>
        <FoodChainBuilder />
      </div>

      {isFullscreen && (
        <Button
          onClick={toggleFullscreen}
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <Minimize className="w-4 h-4 mr-2" />
          Exit Fullscreen
        </Button>
      )}
    </div>
  )
}
