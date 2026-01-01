"use client"

import type React from "react"

import { Search, Moon, Sun, Menu, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"
import { experimentsData } from "@/lib/experiments-data"
import { Card } from "@/components/ui/card"

export function AppHeader() {
  const [isDark, setIsDark] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const isOnExperimentsPage = pathname === "/experiments"

  useEffect(() => {
    const query = searchParams.get("search")
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  const searchResults = searchQuery
    ? experimentsData.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/experiments?search=${encodeURIComponent(searchQuery)}`)
      setShowResults(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowResults(value.length > 0)
  }

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const handleBackToExperimentsFullscreen = () => {
    router.push("/experiments")
    // Request fullscreen after navigation
    setTimeout(() => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log("[v0] Fullscreen request failed:", err)
        })
      }
    }, 100)
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>

          {isOnExperimentsPage && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToExperimentsFullscreen}
              className="gap-2 hidden sm:flex bg-transparent"
              title="View experiments in fullscreen mode"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden lg:inline">Back to Experiments, full screen</span>
              <span className="lg:hidden">Experiments ⛶</span>
            </Button>
          )}
        </div>

        <div className="flex-1 max-w-xl mx-4 relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search experiments..."
                className="pl-10 bg-background"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowResults(true)}
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => {
                    setSearchQuery("")
                    setShowResults(false)
                    router.push("/experiments")
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>

          {showResults && searchResults.length > 0 && (
            <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto shadow-lg z-50">
              <div className="p-2">
                {searchResults.slice(0, 5).map((exp) => (
                  <Link
                    key={exp.id}
                    href={`/experiments/${exp.id}`}
                    onClick={() => setShowResults(false)}
                    className="block p-3 hover:bg-accent rounded-lg transition-colors"
                  >
                    <div className="font-medium">{exp.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{exp.description}</div>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {exp.category}
                    </Badge>
                  </Link>
                ))}
                {searchResults.length > 5 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => {
                      router.push(`/experiments?search=${encodeURIComponent(searchQuery)}`)
                      setShowResults(false)
                    }}
                  >
                    View all {searchResults.length} results
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
