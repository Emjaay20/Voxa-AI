import * as React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { BrainCircuit, CheckCircle2, Loader2 } from "lucide-react"

interface AnalysisViewProps {
  transcript: string
  scenarioId: string
  onComplete: (data: any) => void
}

const loadingSteps = [
  "Transcribing audio with Whisper...",
  "Evaluating clarity and pacing...",
  "Consulting Expert Coach...",
  "Synthesizing executive summary...",
  "Finalizing premium report..."
]

export function AnalysisView({ transcript, scenarioId, onComplete }: AnalysisViewProps) {
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    // Fake progress for the UI while we wait for the real API
    const progressInterval = setInterval(() => {
      setProgress(p => (p >= 90 ? 90 : p + 5))
    }, 500)

    // Cycle through loading steps to keep user engaged
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(i => (i < loadingSteps.length - 1 ? i + 1 : i))
    }, 1500)

    // Start real analysis
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, scenarioId })
    })
    .then(res => res.json())
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
      onComplete({ error: "Failed to connect to AI analysis engine." })
    })

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [transcript, scenarioId, onComplete])

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-8 text-center">
      <div className="relative flex size-24 items-center justify-center rounded-full bg-primary/10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
        />
        <BrainCircuit className="size-10 text-primary animate-pulse" />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-2xl font-bold tracking-tight">Analyzing Performance</h2>
        <div className="h-6 relative overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.p
              key={currentStepIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-muted-foreground absolute w-full text-center"
            >
              {loadingSteps[currentStepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <Progress value={progress} className="h-2 w-full" />
        <span className="text-xs font-medium text-muted-foreground self-end">{progress}%</span>
      </div>
    </div>
  )
}
