import * as React from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function TopNav() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()
  
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"
  const avatarUrl = user?.user_metadata?.avatar_url || ""

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
        <Avatar className="size-8 cursor-pointer">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
