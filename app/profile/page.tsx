"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar, Award, Star, TrendingUp, Clock, CheckCircle2, Bell, Shield } from "lucide-react"
import { SidebarNav } from "@/components/sidebar-nav"
import { AppHeader } from "@/components/app-header"
import { useProgress } from "@/hooks/use-progress"
import { useFavorites } from "@/hooks/use-favorites"
import { useRecent } from "@/hooks/use-recent"
import { experimentsData } from "@/lib/experiments-data"

export default function ProfilePage() {
  const [name, setName] = useState("Emma Martinez")
  const [email, setEmail] = useState("emma.martinez@example.com")
  const [isEditing, setIsEditing] = useState(false)

  const { getCompletedCount, getTotalProgress, getAllProgress } = useProgress()
  const { favorites } = useFavorites()
  const { recent } = useRecent()

  const completedCount = getCompletedCount()
  const totalProgress = getTotalProgress()
  const progressList = getAllProgress()
  const inProgressCount = progressList.filter((p) => !p.completed && p.progress > 0).length

  const joinDate = "January 2025"
  const totalExperiments = experimentsData.length

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first experiment",
      icon: Award,
      unlocked: completedCount >= 1,
      color: "text-blue-500",
    },
    {
      id: 2,
      title: "Chemistry Enthusiast",
      description: "Complete 3 chemistry experiments",
      icon: Award,
      unlocked: false,
      color: "text-green-500",
    },
    {
      id: 3,
      title: "Physics Master",
      description: "Complete 3 physics experiments",
      icon: Award,
      unlocked: false,
      color: "text-purple-500",
    },
    {
      id: 4,
      title: "Dedicated Learner",
      description: "Complete 5 experiments",
      icon: Award,
      unlocked: completedCount >= 5,
      color: "text-orange-500",
    },
    {
      id: 5,
      title: "Science Explorer",
      description: "Try experiments from all categories",
      icon: Award,
      unlocked: false,
      color: "text-pink-500",
    },
    {
      id: 6,
      title: "Perfect Score",
      description: "Complete all experiments",
      icon: Award,
      unlocked: completedCount === totalExperiments,
      color: "text-yellow-500",
    },
  ]

  const unlockedAchievements = achievements.filter((a) => a.unlocked).length

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col">
        <AppHeader />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Profile</h2>
              <p className="text-muted-foreground">Manage your account and view your learning statistics</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-1">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback className="text-2xl">EM</AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle>{name}</CardTitle>
                  <CardDescription>{email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Joined {joinDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{favorites.length} favorites</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{recent.length} recent</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Learning Statistics</CardTitle>
                  <CardDescription>Your progress across all experiments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-2xl font-bold">{totalProgress}%</span>
                      </div>
                      <Progress value={totalProgress} className="h-3" />
                      <p className="text-xs text-muted-foreground">
                        {progressList.length} of {totalExperiments} experiments started
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                          <div className="text-3xl font-bold">{completedCount}</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">In Progress</span>
                          </div>
                          <div className="text-3xl font-bold">{inProgressCount}</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Achievements</h4>
                      <Badge variant="secondary">
                        {unlockedAchievements} / {achievements.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {achievements.slice(0, 6).map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border ${
                            achievement.unlocked ? "bg-primary/5 border-primary/20" : "bg-muted/50 opacity-50"
                          }`}
                        >
                          <achievement.icon
                            className={`w-6 h-6 ${achievement.unlocked ? achievement.color : "text-muted-foreground"}`}
                          />
                          <span className="text-xs text-center font-medium line-clamp-2">{achievement.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button onClick={handleSave}>Save Changes</Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Achievements</CardTitle>
                    <CardDescription>
                      Unlock achievements by completing experiments and exploring the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <Card
                          key={achievement.id}
                          className={achievement.unlocked ? "border-primary/50" : "opacity-60"}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  achievement.unlocked ? "bg-primary/10" : "bg-muted"
                                }`}
                              >
                                <achievement.icon
                                  className={`w-6 h-6 ${achievement.unlocked ? achievement.color : "text-muted-foreground"}`}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{achievement.title}</h4>
                                  {achievement.unlocked && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </div>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        <CardTitle>Notifications</CardTitle>
                      </div>
                      <CardDescription>Manage your notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates about new experiments</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Progress Reminders</p>
                          <p className="text-sm text-muted-foreground">Get reminded about incomplete experiments</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        <CardTitle>Privacy & Security</CardTitle>
                      </div>
                      <CardDescription>Manage your privacy and security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Change Password</p>
                          <p className="text-sm text-muted-foreground">Update your account password</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Change
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Export</p>
                          <p className="text-sm text-muted-foreground">Download your learning data</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
