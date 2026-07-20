import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressJourney } from "./ProgressJourney"
import { UpcomingInterview } from "./UpcomingInterview"
import { AiInsightCard } from "./AiInsightCard"
import { AiCoachesGrid } from "./AiCoachesGrid"
import { PerformanceChart } from "./PerformanceChart"
import { RecentInterviews } from "./RecentInterviews"

export function DashboardOverview() {
  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto pb-10">
      
      {/* Row 1: Progress Journey & Streak */}
      <section>
        <ProgressJourney />
      </section>

      {/* Row 2: Upcoming Interview & AI Insight */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="h-[200px]">
          <UpcomingInterview />
        </div>
        <div className="h-[200px]">
          <AiInsightCard />
        </div>
      </section>

      {/* Row 3: AI Coaching Team */}
      <section>
        <AiCoachesGrid />
      </section>

      {/* Row 4: Analytics & History Tabs */}
      <section>
        <Tabs defaultValue="performance" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">History & Analytics</h2>
            <TabsList className="bg-muted/50 rounded-full">
              <TabsTrigger value="performance" className="rounded-full">Performance</TabsTrigger>
              <TabsTrigger value="recent" className="rounded-full">Recent</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="performance" className="mt-0 outline-none">
            <div className="h-[350px]">
              <PerformanceChart />
            </div>
          </TabsContent>
          <TabsContent value="recent" className="mt-0 outline-none">
            <div className="min-h-[350px]">
              <RecentInterviews />
            </div>
          </TabsContent>
        </Tabs>
      </section>

    </div>
  )
}
