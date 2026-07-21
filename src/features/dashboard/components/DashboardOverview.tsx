import * as React from "react"
import { UpcomingSession } from "./UpcomingSession"
import { AiInsightCard } from "./AiInsightCard"
import { CommunicationDNA } from "./CommunicationDNA"
import { PerformanceChart } from "./PerformanceChart"
import { RecentSessions } from "./RecentSessions"
import { DailyCoach } from "./DailyCoach"

interface DashboardOverviewProps {
  user: any
  sessions: any[]
  scenarios: any[]
  isLocked?: boolean
}

export function DashboardOverview({ user, sessions, scenarios, isLocked }: DashboardOverviewProps) {
  const totalSessions = sessions.length
  const averageScore = totalSessions > 0 ? Math.round(sessions.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / totalSessions) : 0
  const recentScore = totalSessions > 0 ? sessions[0].overall_score : 0
  const prevScore = totalSessions > 1 ? sessions[1].overall_score : recentScore
  
  // Calculate percentage increase instead of flat delta for a more premium feel
  const scorePercentageDelta = prevScore > 0 ? Math.round(((recentScore - prevScore) / prevScore) * 100) : 0
  const streak = user?.current_streak || 0

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6">Track your improvement over time.</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Create a free account to unlock your personal dashboard with advanced analytics, daily streaks, and AI coaching history.
        </p>
        
        <div className="w-full relative rounded-3xl border border-primary/20 bg-card p-8 overflow-hidden shadow-sm">
          {/* Blur Overlay */}
          <div className="absolute inset-0 z-20 bg-background/50 backdrop-blur-[6px] flex flex-col items-center justify-center">
            <a href="/login" className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity">
              Unlock Dashboard
            </a>
          </div>
          
          {/* Fake Teaser Content */}
          <div className="opacity-40 blur-[2px] pointer-events-none select-none">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Communication Score</span>
                <span className="text-6xl font-extrabold">84</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Daily Streak</span>
                <span className="text-2xl font-bold">🔥 3 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-12 max-w-[1200px] mx-auto pb-32 pt-12 px-4 sm:px-8">
      
      {/* Sprint 5: Daily Coach */}
      <DailyCoach user={user} sessions={sessions} />

      {/* Primary Metrics */}
      <section className="flex flex-col lg:flex-row gap-16 justify-between items-start py-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Communication Score</span>
          <div className="flex items-end gap-6">
            <span className="text-8xl sm:text-9xl font-extrabold tracking-tighter leading-none">{averageScore}</span>
            {scorePercentageDelta !== 0 && (
              <span className={`text-2xl sm:text-3xl font-bold pb-2 ${scorePercentageDelta > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {scorePercentageDelta > 0 ? '+' : ''}{scorePercentageDelta}%
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-12 lg:min-w-[300px]">
          {streak > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Momentum</span>
              <span className="text-3xl font-bold tracking-tight">🔥 {streak} Day Streak</span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Today's Goal</span>
              <span className="text-sm font-bold text-foreground">9 / 12 mins</span>
            </div>
            <div className="h-4 w-full bg-muted/40 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-8">
        
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-20">
          
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold tracking-tight text-muted-foreground border-b border-border/40 pb-4">Performance Trend</h2>
            <div className="h-[400px] w-full">
              <PerformanceChart sessions={sessions} />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold tracking-tight text-muted-foreground border-b border-border/40 pb-4">Recent Sessions</h2>
            <div className="min-h-[350px]">
              <RecentSessions sessions={sessions} />
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-20">
          
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold tracking-tight text-muted-foreground border-b border-border/40 pb-4">Practice</h2>
            <div>
              <UpcomingSession scenarios={scenarios} />
            </div>
          </div>
          
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold tracking-tight text-muted-foreground border-b border-border/40 pb-4">AI Coaching</h2>
            <div className="flex flex-col gap-6">
              <AiInsightCard />
              {sessions.length >= 2 && <CommunicationDNA sessions={sessions} />}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
