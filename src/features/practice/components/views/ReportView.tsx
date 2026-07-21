import * as React from "react"
import { motion } from "framer-motion"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, UserCheck, Sparkles, AlertCircle, RefreshCw, Activity, Mic, BrainCircuit } from "lucide-react"
import { COACHES } from "@/features/dashboard/data/constants"
import { cn } from "@/lib/cn"
import Link from "next/link"

interface CoachFeedback {
  coach: string
  feedback: {
    score?: number
    strengths?: string[]
    weaknesses?: string[]
    advice?: string
  } | null
}

import { FinalReportData } from "@/lib/ai/types"

interface ReportViewProps {
  reportData: FinalReportData | any | null
  onFinish: () => void
  onTryAgain?: () => void
  isGuest?: boolean
}

export function ReportView({ reportData, onFinish, onTryAgain, isGuest = false }: ReportViewProps) {
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
    return COACHES.find(c => c.name.includes(coachName)) || COACHES[0]
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-5xl flex-col gap-10 pb-16 pt-24"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Practice Report</h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest shadow-sm">
              <Sparkles className="size-3" /> Powered by AI
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">Your communication profile has been analyzed</p>
        </div>
        <div className="flex gap-3">
          {onTryAgain && (
            <Button onClick={onTryAgain} variant="secondary" className="rounded-full shadow-sm hover:shadow-md transition-all">
              <RefreshCw className="mr-2 size-4" /> Try That Again
            </Button>
          )}
          <Button onClick={onFinish} variant="default" className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-medium">
            Done Reviewing <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>

      {/* Hero Section: Overall Score & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score Card */}
        <Card className="lg:col-span-4 rounded-3xl border-white/10 bg-background/50 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
          <div className="relative p-8 flex flex-col items-center text-center justify-center h-full gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Overall Score</span>
            <div className="flex items-start justify-center">
              <span className="text-[120px] leading-[0.8] font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/50">
                {reportData.overallScore || 0}
              </span>
            </div>
          </div>
        </Card>

        {/* Verdict Card */}
        <Card className="lg:col-span-8 rounded-3xl border-white/10 bg-background/50 backdrop-blur-xl shadow-xl shadow-black/5 p-8 flex flex-col justify-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BrainCircuit className="size-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-primary mb-4">
              <UserCheck className="size-5" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Executive Summary</h3>
            </div>
            <p className="text-2xl sm:text-3xl leading-snug font-medium text-foreground text-balance">
              "{reportData.executiveSummary || "Your response has been analyzed. Review the specific feedback below."}"
            </p>
          </div>
        </Card>
      </div>

      {/* Speech Intelligence Metrics */}
      <div className="flex flex-col gap-6 pt-4">
        <div className="flex items-center gap-2 px-1">
          <Activity className="size-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold tracking-tight">Speech Intelligence</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Confidence */}
          <Card className="rounded-2xl border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-6 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Confidence</span>
            <div className="flex flex-col gap-2 mt-auto">
              <span className="text-4xl font-semibold tracking-tight">{reportData.metrics?.speakingConfidence || 0}%</span>
              <Progress value={reportData.metrics?.speakingConfidence || 0} className="h-1.5 w-full bg-white/5" />
            </div>
          </Card>

          {/* Speaking Pace */}
          <Card className="rounded-2xl border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-6 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pace (WPM)</span>
            <div className="flex flex-col mt-auto">
              <span className="text-4xl font-semibold tracking-tight">{reportData.metrics?.wordsPerMinute || 0}</span>
              <span className={cn(
                "text-xs font-bold uppercase tracking-widest mt-2",
                (reportData.metrics?.wordsPerMinute || 0) > 160 ? "text-rose-400" : (reportData.metrics?.wordsPerMinute || 0) < 110 ? "text-amber-400" : "text-emerald-400"
              )}>
                {(reportData.metrics?.wordsPerMinute || 0) > 160 ? "Too Fast" : (reportData.metrics?.wordsPerMinute || 0) < 110 ? "Too Slow" : "Optimal"}
              </span>
            </div>
          </Card>

          {/* Filler Words */}
          <Card className="rounded-2xl border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-6 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Filler Words</span>
            <div className="flex items-end justify-between mt-auto">
              <span className="text-4xl font-semibold tracking-tight">{reportData.metrics?.fillerWordsCount || 0}</span>
              {reportData.metrics?.fillerWords?.[0] && (
                <span className="text-sm font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded-md mb-1">
                  "{reportData.metrics.fillerWords[0].word}" ({reportData.metrics.fillerWords[0].count}x)
                </span>
              )}
            </div>
          </Card>

          {/* Structure */}
          <Card className="rounded-2xl border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-6 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Structure</span>
            <div className="flex flex-col gap-1 mt-auto">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Richness</span>
                <span className="font-medium">{reportData.metrics?.vocabularyRichness || 0}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sentence</span>
                <span className="font-medium">{reportData.metrics?.averageSentenceLength || 0} w/s</span>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* Aggregate Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6 pt-4">
        {reportData.topStrengths && reportData.topStrengths.length > 0 && (
          <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-2 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500">Top Strengths</h3>
            </div>
            <ul className="space-y-4">
              {reportData.topStrengths?.map((strength: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm font-medium text-foreground/90 leading-relaxed">
                  <span className="text-emerald-500/50 select-none">0{i+1}</span>
                  {strength}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {reportData.topWeaknesses && reportData.topWeaknesses.length > 0 && (
          <Card className="rounded-2xl border-rose-500/20 bg-rose-500/5 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-2 rounded-full bg-rose-500" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-rose-500">Areas to Improve</h3>
            </div>
            <ul className="space-y-4">
              {reportData.topWeaknesses?.map((weakness: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm font-medium text-foreground/90 leading-relaxed">
                  <span className="text-rose-500/50 select-none">0{i+1}</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Deep Dive Scorecards */}
      <div className="flex flex-col gap-6 pt-4">
        <div className="flex items-center gap-2 px-1">
          <Mic className="size-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold tracking-tight">Coach Scorecards</h3>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reportData.results?.map((result: any, i: number) => {
            const meta = getCoachMeta(result.coach)
            const f = result.feedback
            
            if (!f) return null

            return (
              <motion.div
                key={result.coach}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1 + (i * 0.05), duration: 0.3 }}
              >
                <Card className="flex flex-col h-full rounded-2xl border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 p-6 group overflow-hidden relative">
                  <div className={cn("absolute top-0 left-0 w-full h-1 opacity-20 group-hover:opacity-100 transition-opacity", meta.bgClass)} />
                  
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex size-8 items-center justify-center rounded-lg shadow-inner", meta.bgClass, meta.colorClass)}>
                        <Sparkles className="size-4" />
                      </div>
                      <h4 className="font-semibold tracking-tight">{meta.name}</h4>
                    </div>
                    {f.score !== undefined && (
                      <span className="text-lg font-bold">
                        {f.score}
                        <span className="text-xs text-muted-foreground">/100</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 flex-1">
                    {f.advice && (
                      <div className="bg-white/5 rounded-xl p-4 mt-auto">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Advice</span>
                        <p className="text-sm font-medium text-foreground leading-relaxed">{f.advice}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {isGuest && (
        <Card className="rounded-3xl border-primary/20 bg-primary/5 p-10 text-center shadow-2xl flex flex-col items-center relative overflow-hidden mt-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
          <div className="relative z-10 flex flex-col items-center">
            <Sparkles className="mx-auto mb-6 size-8 text-primary" />
            <h3 className="text-2xl font-bold tracking-tight mb-3 text-balance">You've completed your first coaching session.</h3>
            <p className="text-muted-foreground mb-8">Create your free account to unlock your full potential:</p>
            <div className="grid grid-cols-2 gap-4 text-left max-w-md w-full mx-auto mb-10">
              <div className="flex items-center gap-3 text-sm font-medium bg-background/50 backdrop-blur-sm p-3 rounded-xl border border-white/5"><div className="size-1.5 rounded-full bg-primary" /> Save reports forever</div>
              <div className="flex items-center gap-3 text-sm font-medium bg-background/50 backdrop-blur-sm p-3 rounded-xl border border-white/5"><div className="size-1.5 rounded-full bg-primary" /> Track improvement over time</div>
              <div className="flex items-center gap-3 text-sm font-medium bg-background/50 backdrop-blur-sm p-3 rounded-xl border border-white/5"><div className="size-1.5 rounded-full bg-primary" /> Unlimited AI practice</div>
              <div className="flex items-center gap-3 text-sm font-medium bg-background/50 backdrop-blur-sm p-3 rounded-xl border border-white/5"><div className="size-1.5 rounded-full bg-primary" /> Advanced analytics dashboard</div>
            </div>
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-10 h-14 text-base font-semibold shadow-xl shadow-primary/20 hover:scale-105 transition-transform")}
            >
              Create Free Account <ArrowRight className="ml-2 size-5" />
            </Link>
          </div>
        </Card>
      )}

    </motion.div>
  )
}
