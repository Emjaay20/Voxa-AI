import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { mockUpcomingInterview } from "../data/mock"

export function UpcomingInterview() {
  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-[24px] border-border/50 bg-card p-6 shadow-sm relative h-full">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <Calendar className="size-4" />
          <span className="text-sm font-medium uppercase tracking-wider">Upcoming</span>
        </div>
        <h3 className="text-2xl font-bold tracking-tight">{mockUpcomingInterview.company} {mockUpcomingInterview.role}</h3>
        <p className="text-muted-foreground">{mockUpcomingInterview.day} at {mockUpcomingInterview.time}</p>
      </div>

      <div className="mt-8">
        <Button className="w-full sm:w-auto rounded-full font-medium" size="sm">
          Continue Practice <ArrowRight className="ml-2 size-3.5" />
        </Button>
      </div>
    </Card>
  )
}
