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
import { mockRecentSessions } from "../data/mock"

export function RecentSessions() {
  return (
    <Card className="rounded-[24px] border-border/40 shadow-sm h-full flex flex-col bg-card">
      <CardHeader className="pb-2 flex-none">
        <CardTitle className="text-lg font-bold">Recent Sessions</CardTitle>
        <CardDescription>Your latest practice recordings.</CardDescription>
      </CardHeader>
      <div className="flex flex-col gap-4 p-6 pt-0">
        {mockRecentSessions.map((session) => (
          <div key={session.id} className="group flex items-center justify-between rounded-xl border border-transparent p-3 hover:bg-muted/50 hover:border-border/50 transition-all">
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Video className="size-4" />
              </div>
              <div>
                <p className="font-medium">{session.role}</p>
                <p className="text-xs text-muted-foreground">{session.date}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-bold">{session.score}/100</span>
              <Badge variant={session.status === "Completed" ? "success" : "warning"} className="h-4 text-[10px] px-1.5">
                {session.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
