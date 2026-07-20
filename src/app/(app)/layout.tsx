import * as React from "react"
import { DashboardShell } from "@/features/dashboard"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  )
}
