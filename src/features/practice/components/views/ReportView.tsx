import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, UserCheck, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import { mockCoaches } from "@/features/dashboard/data/mock"
import { cn } from "@/lib/cn"

interface CoachFeedback {
  coach: string
  feedback: {
    score?: number
    strengths?: string[]
    weaknesses?: string[]
    advice?: string
  } | null
}

interface ReportData {
  results?: CoachFeedback[]
  error?: string
}

interface ReportViewProps {
  reportData: ReportData | null
  onFinish: () => void
}

export function ReportView({ reportData, onFinish }: ReportViewProps) {
  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="size-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold">Failed to load report data</h2>
        <Button onClick={onFinish} className="mt-6">Return to Dashboard</Button>
      </div>
    )
  }

  if (reportData.error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto">
        <AlertCircle className="size-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold">Analysis Error</h2>
        <p className="text-muted-foreground mt-2">{reportData.error}</p>
        <Button onClick={onFinish} className="mt-6">Return to Dashboard</Button>
      </div>
    )
  }

  // Synthesize top-level insight
  const expertResult = reportData.results?.find(r => r.coach === "Expert")
  const topInsight = expertResult?.feedback?.advice || 
    "Your response has been analyzed. Review the specific feedback from each coach below to improve your communication."

  const getCoachMeta = (coachName: string) => {
    return mockCoaches.find(c => c.name.includes(coachName)) || mockCoaches[0]
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-4xl flex-col gap-8 pb-12"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Practice Report</h2>
        <Button onClick={onFinish} variant="outline" className="rounded-full">
          Done Reviewing <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>

      {/* The Synthesis Card */}
      <Card className="relative overflow-hidden rounded-[32px] border-primary/20 bg-primary/5 p-8 shadow-sm">
        <div className="absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-primary">
            <UserCheck className="size-6" />
            <h3 className="text-xl font-bold tracking-tight">Communication Insights</h3>
          </div>
          
          <p className="text-lg leading-relaxed text-foreground/90 text-balance font-medium">
            "{topInsight}"
          </p>
        </div>
      </Card>

      {/* Breakdowns from Coaches */}
      <div className="mt-4">
        <h3 className="text-xl font-bold tracking-tight mb-6">Detailed Breakdowns</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {reportData.results?.map((result, i) => {
            const meta = getCoachMeta(result.coach)
            const f = result.feedback
            
            if (!f) return null

            return (
              <motion.div
                key={result.coach}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
              >
                <Card className="flex flex-col h-full gap-4 rounded-[24px] border-border/50 bg-card p-6 shadow-sm hover:border-primary/20 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex size-8 items-center justify-center rounded-lg", meta.bgClass, meta.colorClass)}>
                        <Sparkles className="size-4" />
                      </div>
                      <h4 className="font-semibold">{meta.name}</h4>
                    </div>
                    {f.score !== undefined && (
                      <span className={cn("text-xs font-bold px-2 py-1 rounded-md", meta.bgClass, meta.colorClass)}>
                        Score: {f.score}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 flex-1">
                    {f.strengths && f.strengths.length > 0 && (
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1 block">Strength</span>
                        <p className="text-sm text-muted-foreground">{f.strengths[0]}</p>
                      </div>
                    )}
                    
                    {f.weaknesses && f.weaknesses.length > 0 && (
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-1 block">Improvement</span>
                        <p className="text-sm text-muted-foreground">{f.weaknesses[0]}</p>
                      </div>
                    )}

                    {f.advice && (
                      <div className="mt-auto pt-3 border-t border-border/50">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">Advice</span>
                        <p className="text-sm font-medium">{f.advice}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

    </motion.div>
  )
}
