import * as React from "react"
import { Card } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    isPositive: boolean
  }
}

export function MetricCard({ title, value, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card className="flex flex-col gap-2 rounded-2xl p-6 shadow-sm border-border/50">
      <div className="flex items-center justify-between text-muted-foreground">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="flex size-8 items-center justify-center rounded-lg bg-muted/50">
          <Icon className="size-4 text-foreground/70" />
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs font-medium ${trend.isPositive ? "text-emerald-500" : "text-destructive"}`}>
            {trend.value}
          </span>
        )}
      </div>
    </Card>
  )
}
