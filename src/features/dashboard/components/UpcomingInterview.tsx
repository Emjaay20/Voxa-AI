import * as React from "react"
import { Card } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { mockUpcomingInterview } from "../data/mock"
import { cn } from "@/lib/cn"

export function UpcomingInterview() {
  return (
    <Card className="rounded-[24px] border-border/40 bg-card shadow-sm h-full flex flex-col justify-between overflow-hidden relative group cursor-pointer hover:border-primary/20 transition-all">
      <div className="p-6 pb-2 z-10 flex-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Today's Practice</h3>
          </div>
        </div>
        <h3 className="text-2xl font-bold tracking-tight">{mockUpcomingInterview.company} {mockUpcomingInterview.role}</h3>
        <p className="text-muted-foreground">{mockUpcomingInterview.day} at {mockUpcomingInterview.time}</p>
      </div>

      <div className="mt-8 p-6 pt-2">
        <Link 
          href="/practice" 
          className={cn(buttonVariants({ variant: "default", size: "sm" }), "w-full sm:w-auto rounded-full font-medium")}
        >
          Continue Practice <ArrowRight className="ml-2 size-3.5" />
        </Link>
      </div>
    </Card>
  )
}
