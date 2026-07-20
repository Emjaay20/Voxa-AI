import * as React from "react"
import { Users, Target, AlertTriangle } from "lucide-react"
import { mockMetrics, mockUser } from "../data/mock"
import { MetricCard } from "./MetricCard"
import { PerformanceChart } from "./PerformanceChart"
import { RecentInterviews } from "./RecentInterviews"

export function DashboardOverview() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {mockUser.name}</h1>
        <p className="text-muted-foreground mt-2">Here is a summary of your interview performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard 
          title="Total Interviews" 
          value={mockMetrics.totalInterviews} 
          icon={Users} 
          trend={{ value: "+2 this week", isPositive: true }}
        />
        <MetricCard 
          title="Avg. Score" 
          value={`${mockMetrics.avgScore}/10`} 
          icon={Target} 
          trend={{ value: "+0.4", isPositive: true }}
        />
        <MetricCard 
          title="Areas for Improvement" 
          value={mockMetrics.areasForImprovement} 
          icon={AlertTriangle} 
          trend={{ value: "Action required", isPositive: false }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <PerformanceChart />
        <RecentInterviews />
      </div>
    </div>
  )
}
