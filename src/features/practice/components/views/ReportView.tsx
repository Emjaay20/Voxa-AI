import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, UserCheck, Sparkles, AlertCircle, RefreshCw, Activity, Mic } from "lucide-react"
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
  overallScore?: number
  executiveSummary?: string
  topStrengths?: string[]
  topWeaknesses?: string[]
  fillerWords?: { word: string; count: number }[]
  speakingPace?: number
  results?: CoachFeedback[]
  error?: string
}

interface ReportViewProps {
  reportData: ReportData | null
  onFinish: () => void
  onTryAgain?: () => void
}

export function ReportView({ reportData, onFinish, onTryAgain }: ReportViewProps) {
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
        <div className="flex gap-3">
          {onTryAgain && (
            <Button onClick={onTryAgain} variant="secondary" className="rounded-full">
              <RefreshCw className="mr-2 size-4" /> Try That Again
            </Button>
          )}
          <Button onClick={onFinish} variant="outline" className="rounded-full">
            Done Reviewing <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>

      {/* Hero Section: Overall Score & Summary */}
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card className="flex flex-col items-center justify-center p-8 rounded-[32px] border-primary/20 bg-primary/5 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_70%)]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 relative z-10">Overall Score</h3>
          <div className="text-7xl font-extrabold tracking-tighter text-foreground relative z-10">
            {reportData.overallScore || 0}
          </div>
        </Card>

        <Card className="p-8 rounded-[32px] border-border/50 bg-card shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 text-primary mb-4">
            <UserCheck className="size-6" />
            <h3 className="text-xl font-bold tracking-tight">Your Coach's Verdict</h3>
          </div>
          <p className="text-lg leading-relaxed text-foreground/90 font-medium">
            "{reportData.executiveSummary || "Your response has been analyzed. Review the specific feedback below."}"
          </p>
        </Card>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 rounded-[24px] border-border/50 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mic className="size-4" />
            <span className="font-semibold text-sm uppercase tracking-wider">Top Filler Words</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            {reportData.fillerWords && reportData.fillerWords.length > 0 ? (
              reportData.fillerWords.map((fw, i) => (
                <span key={i} className="px-3 py-1 bg-muted rounded-full text-sm font-medium">
                  {fw.word} <span className="text-muted-foreground ml-1">({fw.count})</span>
                </span>
              ))
            ) : (
              <span className="text-sm text-emerald-500 font-medium">None detected! Excellent.</span>
            )}
          </div>
        </Card>

        <Card className="p-6 rounded-[24px] border-border/50 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="size-4" />
            <span className="font-semibold text-sm uppercase tracking-wider">Speaking Pace</span>
          </div>
          <div className="mt-auto">
            <span className="text-3xl font-bold">{reportData.speakingPace || 0}</span>
            <span className="text-muted-foreground ml-2">WPM</span>
            <p className="text-xs text-muted-foreground mt-1">
              {(reportData.speakingPace || 0) > 160 ? "A bit fast" : (reportData.speakingPace || 0) < 110 ? "A bit slow" : "Perfect pacing"}
            </p>
          </div>
        </Card>

        <Card className="p-6 rounded-[24px] border-border/50 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="size-4 text-amber-500" />
            <span className="font-semibold text-sm uppercase tracking-wider text-amber-500">Biggest Win</span>
          </div>
          <p className="text-sm font-medium leading-relaxed mt-auto">
            {reportData.topStrengths?.[0] || "Clear communication."}
          </p>
        </Card>
      </div>

      {/* Aggregate Strengths & Weaknesses */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-8 rounded-[32px] border-emerald-500/20 bg-emerald-500/5">
          <h3 className="text-lg font-bold tracking-tight text-emerald-600 mb-4">Top Strengths</h3>
          <ul className="space-y-3">
            {reportData.topStrengths?.map((strength, i) => (
              <li key={i} className="flex gap-3 text-sm font-medium">
                <div className="size-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </Card>
        
        <Card className="p-8 rounded-[32px] border-rose-500/20 bg-rose-500/5">
          <h3 className="text-lg font-bold tracking-tight text-rose-600 mb-4">Habits Holding You Back</h3>
          <ul className="space-y-3">
            {reportData.topWeaknesses?.map((weakness, i) => (
              <li key={i} className="flex gap-3 text-sm font-medium">
                <div className="size-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                {weakness}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Breakdowns from Coaches */}
      <div className="mt-8">
        <h3 className="text-xl font-bold tracking-tight mb-6">Deep Dive Scorecards</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reportData.results?.map((result, i) => {
            const meta = getCoachMeta(result.coach)
            const f = result.feedback
            
            if (!f) return null

            return (
              <motion.div
                key={result.coach}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
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
                        {f.score}/100
                      </span>
                    )}
                  </div>
                  
                  {f.score !== undefined && (
                    <Progress value={f.score} className="h-1.5 w-full bg-muted" />
                  )}

                  <div className="flex flex-col gap-3 flex-1 mt-2">
                    {f.advice && (
                      <p className="text-sm font-medium text-foreground/90">{f.advice}</p>
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
