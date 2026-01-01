"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Play, TrendingUp, Award, Target, CheckCircle2, LogOut } from "lucide-react"
import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { AppHeader } from "@/components/app-header"
import Image from "next/image"
import { experimentsData } from "@/lib/experiments-data"
import { useProgress } from "@/hooks/use-progress"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const iconMap: Record<string, any> = {
  Planet: Play,
  Beaker: Play,
  Molecule: Play,
  Atom: Play,
  Globe: Play,
  Zap: Play,
}

export default function ProgressPage() {
  const { getAllProgress, getCompletedCount, getOverallProgress, isLoading, user } = useProgress()
  const router = useRouter()

  const progressList = getAllProgress()
  const experimentsWithProgress = progressList
    .map((prog) => ({
      ...experimentsData.find((exp) => exp.id === prog.id),
      ...prog,
    }))
    .filter((exp) => exp.title)
    .sort((a, b) => b.lastAccessed - a.lastAccessed)

  const completedCount = getCompletedCount()
  const overallProgress = getOverallProgress()
  const inProgressCount = progressList.filter((p) => !p.completed && p.progress > 0).length

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

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-background">
        <SidebarNav />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 flex items-center justify-center">
            <Card className="max-w-md w-full">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Track Your Progress</CardTitle>
                <CardDescription>Sign in to save and sync your experiment progress across devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/auth/login">
                  <Button className="w-full" size="lg">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    Create Account
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground">
                  Your local progress will be synced after signing in
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col">
        <AppHeader />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Learning Progress</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">Track your journey through virtual science experiments</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                    <Target className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{overallProgress}%</div>
                  <Progress value={overallProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {completedCount} of {experimentsData.length} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{completedCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {completedCount} of {experimentsData.length} experiments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{inProgressCount}</div>
                  <p className="text-xs text-muted-foreground">Active experiments</p>
                </CardContent>
              </Card>
            </div>

            {experimentsWithProgress.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-muted-foreground" />
                </div>
                <CardTitle className="mb-2">No progress yet</CardTitle>
                <CardDescription className="mb-4">
                  Start exploring experiments to track your learning progress
                </CardDescription>
                <Link href="/experiments">
                  <Button>Browse Experiments</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Your Experiments</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {experimentsWithProgress.map((experiment: any) => {
                    const IconComponent = iconMap[experiment.icon as string] || Play
                    return (
                      <Card
                        key={experiment.id}
                        className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex gap-4 p-6">
                          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={experiment.image || "/placeholder.svg"}
                              alt={experiment.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                  {experiment.title}
                                </h4>
                                <Badge variant="secondary" className="mt-1">
                                  {experiment.category}
                                </Badge>
                              </div>
                              {experiment.completed && (
                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{experiment.progress}%</span>
                              </div>
                              <Progress value={experiment.progress} className="h-2" />
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                  {experiment.completedSegments?.length || 0} of {experiment.segments?.length || 0}{" "}
                                  segments
                                </span>
                                <Badge className={getDifficultyColor(experiment.difficulty)} variant="outline">
                                  {experiment.difficulty}
                                </Badge>
                              </div>
                            </div>
                            <Link href={`/experiments/${experiment.id}`}>
                              <Button className="w-full mt-4" size="sm">
                                {experiment.completed ? "Review" : "Continue"}
                                <Play className="w-3 h-3 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
