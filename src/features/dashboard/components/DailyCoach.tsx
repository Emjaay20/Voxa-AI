import * as React from "react"

interface DailyCoachProps {
  user: any
  sessions: any[]
}

export function DailyCoach({ user, sessions }: DailyCoachProps) {
  // Extract previous weakness from the most recent session
  const lastSession = sessions.length > 0 ? sessions[0] : null
  const weaknesses = lastSession?.communication_metrics?.weaknesses || []
  const mainWeakness = weaknesses.length > 0 ? weaknesses[0] : "filler words"
  
  const recommendedPace = "140–160 WPM"

  return (
    <div className="flex flex-col gap-6 py-8 border-b border-border/40">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Good morning {user?.full_name ? user.full_name.split(' ')[0] : 'there'}.</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-muted-foreground">Today's exercise:</h3>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance leading-tight">
            Explain a difficult technical topic in 90 seconds.
          </h2>
        </div>

        <div className="flex flex-col gap-8 justify-center">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Goal</span>
            <p className="text-3xl font-bold tracking-tight text-foreground">Reduce {mainWeakness} below 3.</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Target Pace</span>
            <p className="text-3xl font-bold tracking-tight text-foreground">{recommendedPace}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
