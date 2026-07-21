import * as React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { BrainCircuit, CheckCircle2, Loader2 } from "lucide-react"

interface AnalysisViewProps {
  transcript: string
  durationSeconds: number
  scenarioId: string
  sessionId?: string
  isGuest?: boolean
  onComplete: (data: any) => void
}

const loadingSteps = [
  "Speech transcribed",
  "Measuring pacing",
  "Detecting filler words",
  "Calculating confidence",
  "Building communication profile",
  "AI coaches discussing performance"
]

export function AnalysisView({ transcript, durationSeconds, scenarioId, sessionId, isGuest = false, onComplete }: AnalysisViewProps) {
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const hasFired = React.useRef(false)

  useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true

    // Fake progress for the UI while we wait for the real API
    const progressInterval = setInterval(() => {
      setProgress(p => (p >= 90 ? 90 : p + 5))
    }, 500)

    // Cycle through loading steps to keep user engaged
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(i => (i < loadingSteps.length - 1 ? i + 1 : i))
    }, 1500)

    // Start real analysis
    fetch(isGuest ? "/api/demo/analyze" : "/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, scenarioId, durationSeconds, sessionId })
    })
    .then(async res => {
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to analyze your practice session.")
      return data
    })
    .then(data => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      setProgress(100)
      setCurrentStepIndex(loadingSteps.length - 1)
      
      // Add slight delay before transition so they see 100%
      setTimeout(() => onComplete(data), 600)
    })
    .catch(err => {
      console.error(err)
      onComplete({ error: err.message || "Failed to connect to AI analysis engine." })
    })

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [durationSeconds, isGuest, onComplete, scenarioId, sessionId, transcript])

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-10 text-left">
      <div className="flex flex-col gap-2 w-full text-center">
        <h2 className="text-3xl font-bold tracking-tight">Analyzing your communication...</h2>
      </div>

      <div className="w-full flex flex-col gap-4 pl-4 md:pl-10">
        {loadingSteps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isComplete = index < currentStepIndex || progress === 100;
          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isActive || isComplete ? 1 : 0.4, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className={`flex size-6 shrink-0 items-center justify-center rounded-full ${isComplete ? 'bg-primary text-primary-foreground' : isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {isComplete ? (
                  <CheckCircle2 className="size-4" />
                ) : isActive ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <div className="size-2 rounded-full bg-current opacity-50" />
                )}
              </div>
              <span className={`text-lg font-medium ${isComplete ? 'text-foreground' : isActive ? 'text-foreground animate-pulse' : 'text-muted-foreground'}`}>
                {step}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="w-full flex flex-col gap-2 opacity-0">
        <Progress value={progress} className="h-2 w-full" />
      </div>
    </div>
  )
}
