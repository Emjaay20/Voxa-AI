"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"

import { SetupView } from "./views/SetupView"
import { CountdownView } from "./views/CountdownView"
import { RecordingView } from "./views/RecordingView"
import { AnalysisView } from "./views/AnalysisView"
import { ReportView } from "./views/ReportView"
import { ComparisonReportView } from "./views/ComparisonReportView"
import { ScenarioSelectionView } from "./views/ScenarioSelectionView"

type PracticeState = "scenario-select" | "setup" | "countdown" | "recording" | "analyzing" | "report"

export interface PracticeAttempt {
  transcript: string
  reportData: any
}

export function PracticeSessionShell({ scenarios = [], isAuthenticated = false }: { scenarios?: any[], isAuthenticated?: boolean }) {
  const [currentState, setCurrentState] = useState<PracticeState>("scenario-select")
  const [scenarioId, setScenarioId] = useState<string>("interview")
  
  // Track attempts for the "Try Again" feature
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([])
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)
  
  // Temporary storage for the current recording before analysis finishes
  const [currentTranscript, setCurrentTranscript] = useState<string>("")
  const [currentDuration, setCurrentDuration] = useState<number>(0)
  
  const router = useRouter()

  const handleTryAgain = () => {
    setCurrentState("countdown")
  }

  const handleAnalysisComplete = (data: any) => {
    if (data.error) {
      toast.error("Analysis Failed", {
        description: data.error,
      })
      // Reset to recording so they can try again if they want, or they can navigate away
      setCurrentState("recording")
      return
    }
    
    if (data.sessionId) setSessionId(data.sessionId)
    setAttempts((prev) => [...prev, { transcript: currentTranscript, reportData: data }])
    setCurrentState("report")
  }

  return (
    <div className="flex h-full min-h-[80vh] w-full flex-col items-center justify-center p-6 relative">
      {!isAuthenticated && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-50">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            Guest Mode
          </div>
          <p className="text-xs text-muted-foreground font-medium bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-md">
            You have 1 free AI coaching session
          </p>
        </div>
      )}
      <AnimatePresence mode="wait">
        {currentState === "scenario-select" && (
          <motion.div key="scenario-select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-4xl">
            <ScenarioSelectionView 
              scenarios={scenarios}
              onSelect={(id) => {
                setScenarioId(id)
                setCurrentState("setup")
              }} 
            />
          </motion.div>
        )}

        {currentState === "setup" && (
          <motion.div key="setup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-4xl">
            <SetupView onStart={() => setCurrentState("countdown")} />
          </motion.div>
        )}
        
        {currentState === "countdown" && (
          <motion.div key="countdown" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-4xl">
            <CountdownView onComplete={() => setCurrentState("recording")} />
          </motion.div>
        )}
        
        {currentState === "recording" && (
          <motion.div key="recording" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-4xl">
            <RecordingView onFinish={(text, durationSeconds) => {
              setCurrentTranscript(text)
              setCurrentDuration(durationSeconds)
              setCurrentState("analyzing")
            }} />
          </motion.div>
        )}
        
        {currentState === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-4xl">
            <AnalysisView 
              transcript={currentTranscript} 
              durationSeconds={currentDuration}
              scenarioId={scenarioId}
              sessionId={sessionId}
              isGuest={!isAuthenticated}
              onComplete={handleAnalysisComplete} 
            />
          </motion.div>
        )}
        
        {currentState === "report" && (
          <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-5xl">
            {attempts.length === 1 ? (
              <ReportView 
                reportData={attempts[0].reportData} 
                onFinish={() => router.push(isAuthenticated ? "/dashboard" : "/")}
                onTryAgain={isAuthenticated ? handleTryAgain : undefined}
                isGuest={!isAuthenticated}
              />
            ) : (
              <ComparisonReportView 
                attempt1={attempts[0]}
                attempt2={attempts[1]}
                onFinish={() => router.push("/dashboard")}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
