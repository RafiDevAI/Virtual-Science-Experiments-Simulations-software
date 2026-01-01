"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Globe, Beaker, Leaf, Mountain } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const dashboardItems = [{ icon: Home, label: "Home", href: "/" }]

const categories = [
  { icon: Globe, label: "Physics", href: "/experiments?category=physics", count: 4, color: "text-blue-500" },
  { icon: Beaker, label: "Chemistry", href: "/experiments?category=chemistry", count: 4, color: "text-green-500" },
  { icon: Leaf, label: "Biology", href: "/experiments?category=biology", count: 1, color: "text-teal-500" },
  {
    icon: Mountain,
    label: "Earth Science",
    href: "/experiments?category=earth-science",
    count: 1,
    color: "text-orange-500",
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card/50 backdrop-blur-sm h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Beaker className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold leading-7">Virtual Science Experiments &amp; Simulations</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
        <div>
          <h2 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dashboard</h2>
          <div className="space-y-1">
            {dashboardItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          
        </div>

        
      </nav>
    </aside>
  )
}
