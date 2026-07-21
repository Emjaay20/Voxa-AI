"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
export function PerformanceChart({ sessions = [] }: { sessions?: any[] }) {
  // Simple map to format sessions into chart data
  const chartData = sessions.slice(0, 10).reverse().map((session, index) => {
    return {
      name: `Session ${index + 1}`,
      score: session.overall_score || 0,
    }
  })

  return (
    <div className="flex h-full flex-col w-full">
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{ 
                borderRadius: "12px", 
                border: "1px solid var(--border)", 
                backgroundColor: "var(--background)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              name="Overall Score"
              stroke="var(--foreground)" 
              strokeWidth={3} 
              dot={{ r: 4, fill: "var(--foreground)", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
