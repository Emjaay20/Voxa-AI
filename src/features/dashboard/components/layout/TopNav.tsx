import * as React from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { mockUser } from "../../data/mock"

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/40 bg-background/50 px-6 backdrop-blur-xl">
      <div className="flex items-center">
        {/* Breadcrumb could go here in the future */}
        <h2 className="text-sm font-medium text-muted-foreground">Overview</h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="size-4" />
        </Button>
        <Avatar src={mockUser.avatarUrl} alt={mockUser.name} fallback={mockUser.name.charAt(0)} className="size-8 cursor-pointer" />
      </div>
    </header>
  )
}
