"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { SetupView } from "./views/SetupView"
import { CountdownView } from "./views/CountdownView"
import { RecordingView } from "./views/RecordingView"
import { AnalysisView } from "./views/AnalysisView"
import { ReportView } from "./views/ReportView"

import { ScenarioSelectionView } from "./views/ScenarioSelectionView"

type PracticeState = "scenario-select" | "setup" | "countdown" | "recording" | "analyzing" | "report"

export function PracticeSessionShell() {
  const [currentState, setCurrentState] = useState<PracticeState>("scenario-select")
  const [scenarioId, setScenarioId] = useState<string>("interview")
  const [transcript, setTranscript] = useState<string>("")
  const [reportData, setReportData] = useState<any>(null)
  const router = useRouter()

  return (
    <div className="flex h-full min-h-[80vh] w-full flex-col items-center justify-center p-6">
      {currentState === "scenario-select" && (
        <ScenarioSelectionView onSelect={(id) => {
          setScenarioId(id)
          setCurrentState("setup")
        }} />
      )}

      {currentState === "setup" && (
        <SetupView onStart={() => setCurrentState("countdown")} />
      )}
      
      {currentState === "countdown" && (
        <CountdownView onComplete={() => setCurrentState("recording")} />
      )}
      
      {currentState === "recording" && (
        <RecordingView onFinish={(text) => {
          setTranscript(text)
          setCurrentState("analyzing")
        }} />
      )}
      
      {currentState === "analyzing" && (
        <AnalysisView 
          transcript={transcript} 
          scenarioId={scenarioId} 
          onComplete={(data) => {
            setReportData(data)
            setCurrentState("report")
          }} 
        />
      )}
      
      {currentState === "report" && (
        <ReportView reportData={reportData} onFinish={() => router.push("/dashboard")} />
      )}
    </div>
  )
}
