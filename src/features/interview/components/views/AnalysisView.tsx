import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, MessageCircle, BrainCircuit, Code, Sparkles, Users, CheckCircle2, Loader2 } from "lucide-react"
import { mockCoaches } from "../../dashboard/data/mock"
import { cn } from "@/lib/cn"

const iconMap: Record<string, React.ElementType> = {
  Target, MessageCircle, BrainCircuit, Code, Sparkles, Users
}

interface AnalysisViewProps {
  onComplete: () => void
}

export function AnalysisView({ onComplete }: AnalysisViewProps) {
  // Initialize progress state for each coach (0 to 100)
  const [progressState, setProgressState] = useState<Record<string, number>>(() => {
    const initialState: Record<string, number> = {}
    mockCoaches.forEach(c => { initialState[c.id] = 0 })
    return initialState
  })

  const [allDone, setAllDone] = useState(false)

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = []
    
    mockCoaches.forEach(coach => {
      // Randomize the speed at which each coach finishes
      const speed = 50 + Math.random() * 150
      
      const interval = setInterval(() => {
        setProgressState(prev => {
          const current = prev[coach.id]
          // Add random chunk
          const next = Math.min(100, current + (Math.random() * 15))
          return { ...prev, [coach.id]: next }
        })
      }, speed)
      
      intervals.push(interval)
    })

    return () => intervals.forEach(clearInterval)
  }, [])

  // Check if all are done
  useEffect(() => {
    const isDone = Object.values(progressState).every(val => val >= 100)
    if (isDone && !allDone) {
      setAllDone(true)
      setTimeout(() => {
        onComplete()
      }, 1500) // Brief pause to let user see all "Done" before transitioning
    }
  }, [progressState, allDone, onComplete])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex w-full max-w-5xl flex-col gap-12"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">The Voxa Coaching Team</h2>
        <p className="text-muted-foreground text-lg">is reviewing your interview.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockCoaches.map((coach, i) => {
          const Icon = iconMap[coach.icon] || Target
          const currentProgress = progressState[coach.id]
          const isFinished = currentProgress >= 100

          return (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="flex flex-col justify-between gap-4 rounded-[20px] border-border/40 bg-card p-5 shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    isFinished ? cn(coach.bgClass, coach.colorClass) : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <h4 className="font-semibold text-sm leading-none">{coach.name}</h4>
                    
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {isFinished ? (
                        <CheckCircle2 className={cn("size-3", coach.colorClass)} />
                      ) : (
                        <Loader2 className={cn("size-3 animate-spin text-muted-foreground")} />
                      )}
                      <span className={cn(
                        "text-xs font-medium",
                        isFinished ? coach.colorClass : "text-muted-foreground"
                      )}>
                        {isFinished ? "Done" : "Analyzing..."}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Progress 
                  value={currentProgress} 
                  className={cn("h-1.5 w-full mt-2 bg-muted")} 
                  indicatorClassName={coach.bgClass.replace('/10', '').replace('bg-', 'bg-')}
                />
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
