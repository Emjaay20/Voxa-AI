import * as React from "react"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { mockInsight } from "../data/mock"

export function AiInsightCard() {
  return (
    <Card className="flex flex-col justify-center rounded-[24px] border-border/50 bg-gradient-to-br from-primary/5 via-background to-background p-6 shadow-sm h-full relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute -top-10 -right-10 size-32 rounded-full bg-primary/20 blur-[50px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Sparkles className="size-4" />
          </div>
          <h3 className="font-semibold tracking-tight">{mockInsight.title}</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed text-balance">
          {mockInsight.text}
        </p>
      </div>
    </Card>
  )
}
