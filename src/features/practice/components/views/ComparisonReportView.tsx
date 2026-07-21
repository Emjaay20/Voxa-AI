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
      className="flex w-full max-w-4xl flex-col gap-8 pb-12 mx-auto"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Growth Report</h2>
        <Button onClick={onFinish} variant="outline" className="rounded-full">
          Done Reviewing <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>

      <Card className="flex flex-col items-center justify-center p-12 rounded-[32px] border-primary/40 bg-primary/5 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.1),transparent_70%)] pointer-events-none" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-8 relative z-10 flex items-center gap-2">
          Communication Score
        </h3>
        
        <div className="flex items-center gap-6 md:gap-12 relative z-10">
          <div className="text-5xl md:text-7xl font-extrabold text-muted-foreground/40">{score1}</div>
          <div className="flex flex-col items-center">
            <div className="text-muted-foreground/30 flex items-center">
              ─────────►
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-6xl md:text-8xl font-extrabold text-foreground">{score2}</div>
            <div className={`text-2xl font-bold mt-2 ${isImprovement ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isImprovement ? '+' : ''}{scoreDelta}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-8 rounded-[32px] border-border/50 bg-card shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mic className="size-5" />
              <span className="font-bold uppercase tracking-wider">Filler Words</span>
            </div>
            {fillerDelta < 0 && (
              <span className="text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-sm">
                {fillerDelta}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-4">
            <div className="text-4xl font-bold text-muted-foreground/40">{f1}</div>
            <div className="text-muted-foreground/30">────►</div>
            <div className="text-5xl font-extrabold text-foreground">{f2}</div>
          </div>
        </Card>

        <Card className="p-8 rounded-[32px] border-border/50 bg-card shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="size-5" />
              <span className="font-bold uppercase tracking-wider">Confidence</span>
            </div>
            {confDelta > 0 && (
              <span className="text-emerald-500 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-sm">
                +{confDelta}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-4">
            <div className="text-4xl font-bold text-muted-foreground/40">{conf1}</div>
            <div className="text-muted-foreground/30">────►</div>
            <div className="text-5xl font-extrabold text-foreground">{conf2}</div>
          </div>
        </Card>
      </div>

      <Card className="p-8 rounded-[32px] border-emerald-500/20 bg-emerald-500/5 mt-4">
        <div className="flex items-center gap-3 text-emerald-600 mb-6">
          <Trophy className="size-6" />
          <h3 className="text-xl font-bold tracking-tight">Today's Progress</h3>
        </div>
        
        <div className="flex flex-col gap-4">
          <p className="font-medium text-lg">
            🏆 You improved today. You didn't just passively read feedback. You actively applied it.
          </p>
          <div className="mt-4 p-4 rounded-2xl bg-card border border-border/50">
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Next Goal</span>
            <p className="font-medium">Maintain a speaking pace of 140 WPM and eliminate "like" from your vocabulary.</p>
          </div>
        </div>
      </Card>

      <div className="mt-4 flex flex-col items-center text-center gap-4 py-8">
        <Button size="lg" onClick={onFinish} className="rounded-full px-8 h-12 text-base">
          Return to Dashboard <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>

    </motion.div>
  )
}
