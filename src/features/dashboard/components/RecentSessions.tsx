import * as React from "react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Video } from "lucide-react"
export function RecentSessions({ sessions = [] }: { sessions?: any[] }) {
  return (
    <div className="flex flex-col gap-2">
      {sessions.length === 0 ? (
        <div className="text-sm text-muted-foreground py-6">No recent sessions found. Start practicing!</div>
      ) : sessions.slice(0, 5).map((session) => (
        <div key={session.id} className="group flex items-center justify-between py-5 border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors px-2 -mx-2 rounded-xl">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                {new Date(session.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <p className="font-extrabold text-2xl tracking-tight capitalize text-foreground group-hover:text-primary transition-colors">
                {session.scenario?.title || session.title || 'Practice Session'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-extrabold text-4xl tracking-tighter">{session.overall_score || 0}</span>
            <span className={`text-xs font-bold uppercase tracking-widest ${session.overall_score >= 80 ? "text-emerald-500" : "text-rose-500"}`}>
              {session.overall_score >= 80 ? "Great" : "Review"}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
