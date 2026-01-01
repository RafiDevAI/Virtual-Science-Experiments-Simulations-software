"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { experimentsData } from "@/lib/experiments-data"

interface ExperimentProgress {
  id: string
  progress: number
  completed: boolean
  lastAccessed: number
  completedSegments: string[]
}

export function useProgress() {
  const [progressData, setProgressData] = useState<Record<string, ExperimentProgress>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()

    const loadProgress = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (user) {
        // Load from Supabase
        const { data, error } = await supabase.from("user_progress").select("*").eq("user_id", user.id)

        if (!error && data) {
          const progressMap: Record<string, ExperimentProgress> = {}
          data.forEach((item) => {
            progressMap[item.experiment_id] = {
              id: item.experiment_id,
              progress: item.progress,
              completed: item.completed,
              lastAccessed: item.last_accessed,
              completedSegments: item.completed_segments || [],
            }
          })
          setProgressData(progressMap)
        }
      } else {
        // Load from localStorage for non-authenticated users
        const stored = localStorage.getItem("progress")
        if (stored) {
          setProgressData(JSON.parse(stored))
        }
      }
      setIsLoading(false)
    }

    loadProgress()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        loadProgress()
      } else {
        // Load from localStorage when logged out
        const stored = localStorage.getItem("progress")
        if (stored) {
          setProgressData(JSON.parse(stored))
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const updateProgress = async (experimentId: string, progress: number, completedSegments: string[] = []) => {
    const supabase = createClient()

    const newProgressData = {
      id: experimentId,
      progress,
      completed: progress >= 100,
      lastAccessed: Date.now(),
      completedSegments,
    }

    setProgressData((prev) => ({
      ...prev,
      [experimentId]: newProgressData,
    }))

    if (user) {
      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          experiment_id: experimentId,
          progress,
          completed: progress >= 100,
          last_accessed: Date.now(),
          completed_segments: completedSegments,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,experiment_id",
        },
      )
    } else {
      // Save to localStorage for non-authenticated users
      const allProgress = {
        ...progressData,
        [experimentId]: newProgressData,
      }
      localStorage.setItem("progress", JSON.stringify(allProgress))
    }
  }

  const getProgress = (experimentId: string) => progressData[experimentId] || null

  const getAllProgress = () => Object.values(progressData)

  const getCompletedCount = () => Object.values(progressData).filter((p) => p.completed).length

  const getTotalProgress = () => {
    const values = Object.values(progressData)
    if (values.length === 0) return 0
    return Math.round(values.reduce((sum, p) => sum + p.progress, 0) / values.length)
  }

  const getOverallProgress = () => {
    const totalExperiments = experimentsData.length
    const completedExperiments = getCompletedCount()
    return Math.round((completedExperiments / totalExperiments) * 100)
  }

  const markAsComplete = async (experimentId: string) => {
    await updateProgress(experimentId, 100, [])
  }

  return {
    progressData,
    updateProgress,
    getProgress,
    getAllProgress,
    getCompletedCount,
    getTotalProgress,
    getOverallProgress,
    markAsComplete,
    isLoading,
    user,
  }
}
