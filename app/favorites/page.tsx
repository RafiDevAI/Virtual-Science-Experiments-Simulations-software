"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Play, Star, Heart } from "lucide-react"
import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { AppHeader } from "@/components/app-header"
import Image from "next/image"
import { experimentsData } from "@/lib/experiments-data"
import { useFavorites } from "@/hooks/use-favorites"

const iconMap: Record<string, any> = {
  Planet: Play,
  Beaker: Play,
  Molecule: Play,
  Atom: Play,
  Globe: Play,
  Zap: Play,
}

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites()

  const favoriteExperiments = experimentsData.filter((exp) => favorites.includes(exp.id))

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
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary fill-primary" />
                </div>
                <h2 className="text-3xl font-bold">Favorite Experiments</h2>
              </div>
              <p className="text-muted-foreground">
                {favoriteExperiments.length === 0
                  ? "You haven't added any favorites yet. Start exploring experiments!"
                  : `You have ${favoriteExperiments.length} favorite experiment${favoriteExperiments.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {favoriteExperiments.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <CardTitle className="mb-2">No favorites yet</CardTitle>
                <CardDescription className="mb-4">
                  Browse experiments and click the star icon to add them to your favorites
                </CardDescription>
                <Link href="/experiments">
                  <Button>Browse Experiments</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteExperiments.map((experiment) => {
                  const IconComponent = iconMap[experiment.icon as string] || Play
                  return (
                    <Card
                      key={experiment.id}
                      className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-muted">
                        <Image
                          src={experiment.image || "/placeholder.svg"}
                          alt={experiment.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute top-2 right-2 rounded-full"
                          onClick={() => toggleFavorite(experiment.id)}
                        >
                          <Star className="w-4 h-4 fill-primary text-primary" />
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
                        <CardDescription className="text-pretty line-clamp-2">{experiment.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{experiment.duration}</span>
                            </div>
                            <Badge className={getDifficultyColor(experiment.difficulty)} variant="outline">
                              {experiment.difficulty}
                            </Badge>
                          </div>

                          <Link href={`/experiments/${experiment.id}`}>
                            <Button className="w-full">
                              Start Experiment
                              <Play className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
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
