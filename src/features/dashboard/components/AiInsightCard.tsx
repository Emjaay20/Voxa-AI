import * as React from "react"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"


export function AiInsightCard() {
  return (
    <div className="flex flex-col gap-4 relative overflow-hidden py-4 border-b border-border/20 last:border-0 px-2 -mx-2">
      {/* Subtle glow effect */}
      <div className="absolute -top-10 -right-10 size-32 rounded-full bg-primary/5 blur-[50px] pointer-events-none" />
      
      <div className="relative z-10 flex items-center gap-4">
        <Sparkles className="size-6 text-primary" />
        <h3 className="font-bold tracking-tight text-xl text-foreground">Coaching Insight</h3>
      </div>
      <div className="relative z-10">
        <p className="text-muted-foreground font-medium leading-relaxed max-w-md">
          Practice more sessions to unlock personalized AI insights based on your communication patterns.
        </p>
      </div>
    </div>
  )
}
