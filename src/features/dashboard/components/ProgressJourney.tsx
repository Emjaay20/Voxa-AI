import * as React from "react"
import { Flame } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { mockUser, mockMetrics } from "../data/mock"

export function ProgressJourney() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between w-full">
      <div className="flex flex-col gap-2 flex-1 max-w-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Level {mockUser.level} Candidate</h2>
          <span className="text-sm font-medium text-muted-foreground">{mockUser.interviewsToNextLevel} interviews to Level {mockUser.level + 1}</span>
        </div>
        <Progress value={65} className="h-2.5 w-full bg-muted/50" />
        
        <div className="flex items-center gap-6 mt-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">{mockMetrics.totalInterviews}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Practice Sessions</span>
          </div>

          <div className="h-10 w-px bg-border/50 hidden sm:block" />

          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">{mockMetrics.averageScore}/100</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Communication Score</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 mt-4 md:mt-0">
        <Flame className="size-5 text-orange-500" />
        <span className="font-bold text-orange-600 dark:text-orange-400">{mockUser.streakDays} Day Practice Streak</span>
      </div>
    </div>
  )
}
