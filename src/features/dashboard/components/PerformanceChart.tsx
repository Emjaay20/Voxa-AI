"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { mockPerformanceData } from "../data/mock"

export function PerformanceChart() {
  return (
    <Card className="flex h-full flex-col rounded-[24px] border-border/50 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight">Performance Trend</h3>
        <p className="text-sm text-muted-foreground">Confidence and Clarity over the last 6 months.</p>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockPerformanceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
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
              dataKey="confidence" 
              stroke="var(--primary)" 
              strokeWidth={3} 
              dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="clarity" 
              stroke="var(--chart-2, #8b5cf6)" 
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--chart-2, #8b5cf6)", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
