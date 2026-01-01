"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Atom,
  Zap,
  Play,
  Clock,
  BarChart3,
  FileCode as Molecule,
  Globe,
  Beaker,
  Plane as Planet,
  Star,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { AppHeader } from "@/components/app-header"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { experimentsData } from "@/lib/experiments-data"
import { useFavorites } from "@/hooks/use-favorites"
import { useProgress } from "@/hooks/use-progress"

const iconMap: Record<string, any> = {
  Planet,
  Beaker,
  Molecule,
  Atom,
  Globe,
  Zap,
}

export default function ExperimentsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const { toggleFavorite, isFavorite } = useFavorites()
  const { getProgress } = useProgress()

  const categories = ["all", "Astronomy", "Physics", "Chemistry", "Geology", "Biology"]

  const filteredExperiments = experimentsData.filter((exp) => {
    const matchesCategory = selectedCategory === "all" || exp.category === selectedCategory
    const matchesSearch =
      !searchQuery ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col">
        <AppHeader />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold">Virtual Experiments</h2>
                  {searchQuery && (
                    <p className="text-muted-foreground mt-1">
                      Found {filteredExperiments.length} results for "{searchQuery}"
                    </p>
                  )}
                  {!searchQuery && (
                    <p className="text-muted-foreground mt-1">
                      {filteredExperiments.length} {filteredExperiments.length === 1 ? "experiment" : "experiments"}{" "}
                      available
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="w-full justify-start">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="capitalize">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {filteredExperiments.length === 0 ? (
              <Card className="p-12 text-center">
                <CardTitle className="mb-2">No experiments found</CardTitle>
                <CardDescription>Try adjusting your search or filter criteria</CardDescription>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperiments.map((experiment) => {
                  const IconComponent = iconMap[experiment.icon as string] || Beaker
                  const progress = getProgress(experiment.id)
                  const isCompleted = progress?.completed || false
                  const progressPercent = progress?.progress || 0

                  return (
                    <Link key={experiment.id} href={`/experiments/${experiment.id}`} className="block">
                      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer h-full">
                        <div className="relative h-48 w-full overflow-hidden bg-muted">
                          <Image
                            src={experiment.image || "/placeholder.svg"}
                            alt={experiment.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          {isCompleted && (
                            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed
                            </div>
                          )}
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-2 right-2 rounded-full"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleFavorite(experiment.id)
                            }}
                          >
                            <Star
                              className={`w-4 h-4 ${isFavorite(experiment.id) ? "fill-primary text-primary" : ""}`}
                            />
                          </Button>
                        </div>
                        <CardHeader>
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <Badge variant="secondary">{experiment.category}</Badge>
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {experiment.title}
                          </CardTitle>
                          <CardDescription className="text-pretty line-clamp-2">
                            {experiment.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {progressPercent > 0 && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>Progress</span>
                                  <span>{progressPercent}%</span>
                                </div>
                                <Progress value={progressPercent} className="h-1.5" />
                              </div>
                            )}

                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{experiment.duration}</span>
                              </div>
                              <Badge className={getDifficultyColor(experiment.difficulty)} variant="outline">
                                {experiment.difficulty}
                              </Badge>
                            </div>

                            <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              {isCompleted ? "Review" : progressPercent > 0 ? "Continue" : "Start Experiment"}
                              <Play className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
