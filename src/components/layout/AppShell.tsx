import * as React from "react"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background selection:bg-primary/10 selection:text-primary">
      {/* 
        This is the main application shell.
        Navigation and Footer components will be injected here in later milestones. 
      */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
