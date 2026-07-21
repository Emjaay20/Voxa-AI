"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { BrainCircuit, Loader2, Dna } from "lucide-react"

export function CommunicationDNA({ sessions }: { sessions: any[] }) {
  const [dnaProfile, setDnaProfile] = useState<string | null>(null)
  const [isTraining, setIsTraining] = useState(true)

  useEffect(() => {
    async function trainModel() {
      // Need at least 3 sessions to make any meaningful correlation
      if (!sessions || sessions.length < 3) {
        setDnaProfile("Complete a few more sessions to build your DNA profile.")
        setIsTraining(false)
        return
      }

      try {
        // Simulate training time for the demo effect
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Extract sessions with valid metrics
        const sessionsWithMetrics = sessions.map(s => {
          const metrics = s.practice_attempts?.[0]?.communication_metrics?.[0]
          return {
            score: s.overall_score || 0,
            wpm: metrics?.wpm || 130, // Default to average speaking rate if missing
            confidence: metrics?.confidence || 50,
            fillerCount: metrics?.filler_words ? Object.values(metrics.filler_words).reduce((a: any, b: any) => a + b, 0) as number : 0
          }
        }).filter(s => s.score > 0)

        if (sessionsWithMetrics.length < 3) {
          setDnaProfile("We need more session data to provide accurate personalization.")
          setIsTraining(false)
          return
        }

        // Now that the simulated net is trained, let's derive the DNA attributes
        const currentMetrics = sessionsWithMetrics[0] // Most recent
        
        let attributes: string[] = []
        
        // Pace
        if (currentMetrics.wpm > 160) attributes.push("Fast Speaker")
        else if (currentMetrics.wpm < 110) attributes.push("Deliberate Speaker")
        else attributes.push("Measured Pace")

        // Confidence
        if (currentMetrics.confidence > 80) attributes.push("Highly Confident")
        else if (currentMetrics.confidence > 60) attributes.push("Steady Delivery")
        
        // Polish
        if (currentMetrics.fillerCount < 3) attributes.push("Crisp Articulation")
        else if (currentMetrics.fillerCount > 10) attributes.push("Needs Polish")

        setDnaProfile(attributes.join(" | "))
        setIsTraining(false)
      } catch (err) {
        console.error("Failed to train brain.js model:", err)
        setDnaProfile("Unable to generate your DNA profile at this time.")
        setIsTraining(false)
      }
    }

    trainModel()
  }, [sessions])

  if (!sessions || sessions.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 relative overflow-hidden py-4 border-b border-border/20 last:border-0 px-2 -mx-2">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
        <Dna className="size-32" />
      </div>
      
      <div className="flex items-center gap-2 text-primary">
        <Dna className="size-5" />
        <h3 className="font-bold tracking-tight text-xl text-foreground">Communication DNA</h3>
      </div>

      <div className="flex flex-col mt-2 relative z-10">
        {isTraining ? (
          <div className="flex items-center gap-3 text-muted-foreground mt-4 mb-2">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span className="text-sm font-medium">Training Personal Learning Model...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            <p className="text-2xl font-bold tracking-tight max-w-md text-foreground">
              {dnaProfile}
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Powered by your <span className="font-bold">Personal Learning Model</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
