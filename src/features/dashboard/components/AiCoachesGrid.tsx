import * as React from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, MessageCircle, BrainCircuit, Code, Sparkles, Users, CheckCircle2, Loader2, Clock } from "lucide-react"
import { mockCoaches } from "../data/mock"
import { cn } from "@/lib/cn"

const iconMap: Record<string, React.ElementType> = {
  Target,
  MessageCircle,
  BrainCircuit,
  Code,
  Sparkles,
  Users,
}

export function AiCoachesGrid() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold tracking-tight">AI Coaching Team</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockCoaches.map((coach) => {
          const Icon = iconMap[coach.icon] || Target
          const isReady = coach.status === "Ready"
          const isAnalyzing = coach.status === "Analyzing..."
          const isWaiting = coach.status === "Waiting"

          return (
            <Card key={coach.id} className="flex flex-col justify-between gap-4 rounded-[20px] border-border/40 bg-card p-5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex size-10 items-center justify-center rounded-xl",
                    isReady ? "bg-emerald-500/10 text-emerald-500" :
                    isAnalyzing ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{coach.name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isReady && <CheckCircle2 className="size-3 text-emerald-500" />}
                      {isAnalyzing && <Loader2 className="size-3 animate-spin text-primary" />}
                      {isWaiting && <Clock className="size-3 text-muted-foreground" />}
                      <span className={cn(
                        "text-xs font-medium",
                        isReady ? "text-emerald-600 dark:text-emerald-400" :
                        isAnalyzing ? "text-primary" :
                        "text-muted-foreground"
                      )}>
                        {coach.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {!isWaiting && (
                <Progress 
                  value={coach.percent} 
                  className={cn(
                    "h-1.5 w-full",
                    isReady ? "bg-emerald-500/20" : "bg-primary/20"
                  )} 
                  indicatorClassName={cn(
                    isReady ? "bg-emerald-500" : "bg-primary"
                  )}
                />
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
