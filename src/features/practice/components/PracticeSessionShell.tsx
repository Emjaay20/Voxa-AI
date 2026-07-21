"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

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

export function PracticeSessionShell() {
  const [currentState, setCurrentState] = useState<PracticeState>("scenario-select")
  const [scenarioId, setScenarioId] = useState<string>("interview")
  
  // Track attempts for the "Try Again" feature
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([])
  
  // Temporary storage for the current recording before analysis finishes
  const [currentTranscript, setCurrentTranscript] = useState<string>("")
  
  const router = useRouter()

  const handleTryAgain = () => {
    setCurrentState("countdown")
  }

  const handleAnalysisComplete = (data: any) => {
    setAttempts((prev) => [...prev, { transcript: currentTranscript, reportData: data }])
    setCurrentState("report")
  }

  return (
    <div className="flex h-full min-h-[80vh] w-full flex-col items-center justify-center p-6 relative">
      <AnimatePresence mode="wait">
        {currentState === "scenario-select" && (
          <motion.div key="scenario-select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-4xl">
            <ScenarioSelectionView onSelect={(id) => {
              setScenarioId(id)
              setCurrentState("setup")
            }} />
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
            <RecordingView onFinish={(text) => {
              setCurrentTranscript(text)
              setCurrentState("analyzing")
            }} />
          </motion.div>
        )}
        
        {currentState === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-4xl">
            <AnalysisView 
              transcript={currentTranscript} 
              scenarioId={scenarioId} 
              onComplete={handleAnalysisComplete} 
            />
          </motion.div>
        )}
        
        {currentState === "report" && (
          <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-5xl">
            {attempts.length === 1 ? (
              <ReportView 
                reportData={attempts[0].reportData} 
                onFinish={() => router.push("/dashboard")}
                onTryAgain={handleTryAgain}
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
