import * as React from "react"
import { cn } from "@/lib/cn"

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  description?: string
  children?: React.ReactNode
}

export function DashboardHeader({
  heading,
  description,
  className,
  children,
  ...props
}: DashboardHeaderProps) {
  return (
    <div
      className={cn("flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8", className)}
      {...props}
    >
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
        {description && (
          <p className="text-lg text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}
