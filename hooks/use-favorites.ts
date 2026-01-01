"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("favorites")
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  const toggleFavorite = (experimentId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(experimentId)
        ? prev.filter((id) => id !== experimentId)
        : [...prev, experimentId]
      localStorage.setItem("favorites", JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const isFavorite = (experimentId: string) => favorites.includes(experimentId)

  return { favorites, toggleFavorite, isFavorite }
}
