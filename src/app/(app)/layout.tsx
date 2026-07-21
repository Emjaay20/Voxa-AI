import * as React from "react"
import { DashboardShell } from "@/features/dashboard"
import { Navbar } from "@/components/layout/Navbar"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    )
  }

  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  )
}
