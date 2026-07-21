import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Trophy, TrendingUp, Sparkles, Target, Mic, Activity } from "lucide-react"
import { PracticeAttempt } from "../PracticeSessionShell"

interface ComparisonReportViewProps {
  attempt1: PracticeAttempt
  attempt2: PracticeAttempt
  onFinish: () => void
}

export function ComparisonReportView({ attempt1, attempt2, onFinish }: ComparisonReportViewProps) {
  const r1 = attempt1.reportData
  const r2 = attempt2.reportData

  const score1 = r1?.overallScore || 0
  const score2 = r2?.overallScore || 0
  const scoreDelta = score2 - score1
  const isImprovement = scoreDelta >= 0

  const f1 = r1?.fillerWords?.reduce((sum: number, w: any) => sum + w.count, 0) || 0
  const f2 = r2?.fillerWords?.reduce((sum: number, w: any) => sum + w.count, 0) || 0
  const fillerDelta = f2 - f1

  // Extract Confidence Score specifically if available (fallback to 0)
  const getCoachScore = (report: any, coachName: string) => {
    return report?.results?.find((r: any) => r.coach === coachName)?.feedback?.score || 0
  }
  const conf1 = getCoachScore(r1, "Confidence")
  const conf2 = getCoachScore(r2, "Confidence")
  const confDelta = conf2 - conf1

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-4xl flex-col gap-12 pb-12 mx-auto"
    >
      <div className="flex items-center justify-between pb-8 border-b border-border/40">
        <h2 className="text-4xl font-extrabold tracking-tight">Growth Report</h2>
        <Button onClick={onFinish} variant="outline" className="rounded-full">
          Done Reviewing <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-16 border-b border-border/40 pb-16">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
            <Sparkles className="size-4" /> Communication Score
          </span>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-16">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold text-muted-foreground uppercase tracking-wider">Before</span>
              <div className="text-6xl md:text-8xl font-extrabold text-muted-foreground/40">{score1}</div>
            </div>
            
            <div className="hidden lg:flex text-muted-foreground/30">
              ─────────►
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold text-muted-foreground uppercase tracking-wider">After</span>
              <div className="flex items-start gap-4">
                <div className="text-8xl md:text-[120px] leading-none font-extrabold text-foreground">{score2}</div>
                <div className={`text-3xl font-bold mt-2 ${isImprovement ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isImprovement ? '+' : ''}{scoreDelta}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-12 md:grid-cols-2 border-b border-border/40 pb-12">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mic className="size-6" />
              <span className="text-lg font-bold uppercase tracking-wider">Filler Words</span>
            </div>
            {fillerDelta < 0 && (
              <span className="text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-sm">
                {fillerDelta}
              </span>
            )}
          </div>
          
          <div className="flex items-end gap-6 mt-auto">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Before</span>
              <div className="text-5xl font-bold text-muted-foreground/40">{f1}</div>
            </div>
            <div className="text-muted-foreground/30 pb-2">────►</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">After</span>
              <div className="text-6xl font-extrabold text-foreground">{f2}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Target className="size-6" />
              <span className="text-lg font-bold uppercase tracking-wider">Confidence</span>
            </div>
            {confDelta > 0 && (
              <span className="text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-sm">
                +{confDelta}
              </span>
            )}
          </div>
          
          <div className="flex items-end gap-6 mt-auto">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Before</span>
              <div className="text-5xl font-bold text-muted-foreground/40">{conf1}</div>
            </div>
            <div className="text-muted-foreground/30 pb-2">────►</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">After</span>
              <div className="text-6xl font-extrabold text-foreground">{conf2}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 py-4">
        <div className="flex items-center gap-3 text-emerald-500">
          <Trophy className="size-8" />
          <h3 className="text-3xl font-extrabold tracking-tight">Today's Progress</h3>
        </div>
        
        <div className="flex flex-col gap-8">
          <p className="font-medium text-2xl text-balance leading-relaxed">
            🏆 You improved today. You didn't just passively read feedback. You actively applied it.
          </p>
          <div className="flex flex-col gap-3 py-6 px-4 -mx-4 rounded-2xl bg-muted/30 border border-border/50">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Next Goal</span>
            <p className="font-bold text-xl">Maintain a speaking pace of 140 WPM and eliminate "like" from your vocabulary.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center text-center gap-4 py-8">
        <Button size="lg" onClick={onFinish} className="rounded-full px-8 h-14 text-lg font-bold">
          Return to Dashboard <ArrowRight className="ml-2 size-5" />
        </Button>
      </div>

    </motion.div>
  )
}
