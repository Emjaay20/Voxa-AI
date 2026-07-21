import * as React from "react"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1 bg-background">{children}</main>
    </div>
  )
}
