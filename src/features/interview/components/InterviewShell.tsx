"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { SetupView } from "./views/SetupView"
import { CountdownView } from "./views/CountdownView"
import { RecordingView } from "./views/RecordingView"
import { AnalysisView } from "./views/AnalysisView"
import { ReportView } from "./views/ReportView"

type InterviewState = "setup" | "countdown" | "recording" | "analyzing" | "report"

export function InterviewShell() {
  const [currentState, setCurrentState] = useState<InterviewState>("setup")
  const router = useRouter()

  return (
    <div className="flex h-full min-h-[80vh] w-full flex-col items-center justify-center p-6">
      {currentState === "setup" && (
        <SetupView onStart={() => setCurrentState("countdown")} />
      )}
      
      {currentState === "countdown" && (
        <CountdownView onComplete={() => setCurrentState("recording")} />
      )}
      
      {currentState === "recording" && (
        <RecordingView onFinish={() => setCurrentState("analyzing")} />
      )}
      
      {currentState === "analyzing" && (
        <AnalysisView onComplete={() => setCurrentState("report")} />
      )}
      
      {currentState === "report" && (
        <ReportView onFinish={() => router.push("/dashboard")} />
      )}
    </div>
  )
}
