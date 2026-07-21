import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Trophy, TrendingUp, Sparkles } from "lucide-react"
import { PracticeAttempt } from "../PracticeSessionShell"

interface ComparisonReportViewProps {
  attempt1: PracticeAttempt
  attempt2: PracticeAttempt
  onFinish: () => void
}

export function ComparisonReportView({ attempt1, attempt2, onFinish }: ComparisonReportViewProps) {
  const r1 = attempt1.reportData
  const r2 = attempt2.reportData

  const scoreDelta = (r2?.overallScore || 0) - (r1?.overallScore || 0)
  const isImprovement = scoreDelta >= 0

  const fillerDelta = (
    r2?.fillerWords?.reduce((sum: number, w: any) => sum + w.count, 0) || 0
  ) - (
    r1?.fillerWords?.reduce((sum: number, w: any) => sum + w.count, 0) || 0
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-4xl flex-col gap-8 pb-12"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Growth Report</h2>
        <Button onClick={onFinish} variant="outline" className="rounded-full">
          Done Reviewing <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col items-center justify-center p-8 rounded-[32px] border-border/50 bg-card shadow-sm relative overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 relative z-10">Attempt 1</h3>
          <div className="text-6xl font-extrabold tracking-tighter text-muted-foreground/50 relative z-10">
            {r1?.overallScore || 0}
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center p-8 rounded-[32px] border-primary/40 bg-primary/10 shadow-lg relative overflow-hidden transform scale-105 z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.2),transparent_70%)]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 relative z-10 flex items-center gap-2">
            Attempt 2 <Sparkles className="size-4" />
          </h3>
          <div className="text-7xl font-extrabold tracking-tighter text-foreground relative z-10 flex items-center gap-4">
            {r2?.overallScore || 0}
            <span className={`text-2xl font-bold ${isImprovement ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isImprovement ? '+' : ''}{scoreDelta}
            </span>
          </div>
        </Card>
      </div>

      <Card className="p-8 rounded-[32px] border-emerald-500/20 bg-emerald-500/5 mt-4">
        <div className="flex items-center gap-3 text-emerald-600 mb-6">
          <Trophy className="size-6" />
          <h3 className="text-xl font-bold tracking-tight">What improved</h3>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2">
          {fillerDelta < 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold uppercase tracking-wider text-emerald-600/70">Filler Words</span>
              <p className="font-medium">You reduced your filler words by {Math.abs(fillerDelta)}. That instantly makes you sound more executive.</p>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold uppercase tracking-wider text-emerald-600/70">Coaching Applied</span>
            <p className="font-medium">You successfully integrated the advice from the coaches in your second attempt.</p>
          </div>
        </div>
      </Card>

      <div className="mt-4 flex flex-col items-center text-center gap-4 py-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <TrendingUp className="size-8" />
        </div>
        <h3 className="text-2xl font-bold">This is how you grow.</h3>
        <p className="text-muted-foreground max-w-lg">
          You didn't just passively read feedback. You actively applied it. 
          Keep doing this, and you will become the communicator people remember.
        </p>
        <Button size="lg" onClick={onFinish} className="mt-4 rounded-full px-8">
          Return to Dashboard
        </Button>
      </div>

    </motion.div>
  )
}
