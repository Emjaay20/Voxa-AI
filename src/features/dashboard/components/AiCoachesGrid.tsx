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
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  isWaiting ? "bg-muted text-muted-foreground" : cn(coach.bgClass, coach.colorClass)
                )}>
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-semibold text-sm leading-none">{coach.name}</h4>
                  <p className="text-[11px] leading-tight text-muted-foreground">{coach.role}</p>
                  
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {isReady && <CheckCircle2 className={cn("size-3", coach.colorClass)} />}
                    {isAnalyzing && <Loader2 className={cn("size-3 animate-spin", coach.colorClass)} />}
                    {isWaiting && <Clock className="size-3 text-muted-foreground" />}
                    <span className={cn(
                      "text-xs font-medium",
                      isWaiting ? "text-muted-foreground" : coach.colorClass
                    )}>
                      {coach.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {!isWaiting && (
                <Progress 
                  value={coach.percent} 
                  className={cn(
                    "h-1.5 w-full mt-2",
                    coach.bgClass
                  )} 
                  indicatorClassName={coach.bgClass.replace('/10', '').replace('bg-', 'bg-')}
                />
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
