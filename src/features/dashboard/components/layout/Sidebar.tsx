"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Video, MessageSquare, Settings, Sparkles } from "lucide-react"
import { cn } from "@/lib/cn"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Practice Sessions", href: "/practice", icon: Video },
  { name: "Feedback Hub", href: "/feedback", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-border/40 bg-background/50 backdrop-blur-xl md:flex">
      <div className="flex h-14 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <span className="font-bold tracking-tight">Voxa</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-foreground",
                isActive
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
