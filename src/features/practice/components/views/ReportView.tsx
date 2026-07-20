import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, UserCheck, Sparkles } from "lucide-react"
import { mockCoaches } from "@/features/dashboard/data/mock"
import { cn } from "@/lib/cn"

interface ReportViewProps {
  onFinish: () => void
}

export function ReportView({ onFinish }: ReportViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-4xl flex-col gap-8 pb-12"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Interview Report</h2>
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
            <h3 className="text-xl font-bold tracking-tight">If I were your interviewer...</h3>
          </div>
          
          <p className="text-lg leading-relaxed text-foreground/90 text-balance">
            "I would likely move you to the next round. Your technical explanations were strong, but your answers became less structured when discussing past failures. Spend five minutes practicing behavioral storytelling before your interview."
          </p>
        </div>
      </Card>

      {/* Breakdowns from Coaches */}
      <div className="mt-4">
        <h3 className="text-xl font-bold tracking-tight mb-6">Detailed Breakdowns</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {mockCoaches.map((coach, i) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
            >
              <Card className="flex flex-col gap-3 rounded-[24px] border-border/50 bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={cn("flex size-8 items-center justify-center rounded-lg", coach.bgClass, coach.colorClass)}>
                    <Sparkles className="size-4" />
                  </div>
                  <h4 className="font-semibold">{coach.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {coach.role} Analyzed your performance and found specific areas for improvement regarding your delivery and pacing.
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

    </motion.div>
  )
}
