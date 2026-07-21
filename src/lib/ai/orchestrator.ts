import { FinalReportData, AnalysisResult } from "./types"
import { calculateSpeechMetrics } from "../intelligence/metrics"
import { groqAnalyze, groqTranscribe } from "./groq"
import { openAIAnalyze, openAITranscribe } from "./openai"
import { geminiAnalyze } from "./gemini"
import { localTranscribe } from "./local-transcribe"
import { getFallbackAnalysis } from "./fallback"

export async function analyzeCommunication(transcript: string, scenarioSlug: string, durationSeconds: number, previousWeaknesses?: string[]): Promise<FinalReportData> {
  const metrics = calculateSpeechMetrics(transcript, durationSeconds)
  let aiResult: AnalysisResult

  // 1. Try Groq (Primary, Fast, Cheap)
  try {
    aiResult = await groqAnalyze(transcript, scenarioSlug, previousWeaknesses, metrics)
  } catch (groqError) {
    console.warn("Groq analysis failed, falling back to OpenAI...", groqError)

    // 2. Try OpenAI (Reliable, Strict Zod Support)
    try {
      aiResult = await openAIAnalyze(transcript, scenarioSlug, previousWeaknesses, metrics)
    } catch (openAIError) {
      console.warn("OpenAI analysis failed, falling back to Gemini...", openAIError)

      // 3. Try Google Gemini (Fast, Native JSON output)
      try {
        aiResult = await geminiAnalyze(transcript, scenarioSlug, previousWeaknesses, metrics)
      } catch (geminiError) {
        if (process.env.DEMO_MODE === "true") {
          console.warn("Gemini analysis failed, falling back to Mock Data...", geminiError)
          // 4. Fallback (Guarantees UI Never Breaks in demo)
          aiResult = getFallbackAnalysis(transcript)
        } else {
          console.error("AI Analysis failed completely on all 3 providers", geminiError)
          throw new Error("AI services are currently experiencing high traffic. Please try again.")
        }
      }
    }
  }

  return {
    ...aiResult,
    metrics
  }
}

export async function transcribeAudio(file: File): Promise<string> {
  // 1. Try Groq
  try {
    return await groqTranscribe(file)
  } catch (groqError) {
    console.warn("Groq transcription failed, falling back to OpenAI...", groqError)

    // 2. Try OpenAI
    try {
      return await openAITranscribe(file)
    } catch (openAIError) {
      console.warn("OpenAI transcription failed, falling back to local Whisper...", openAIError)
      
      // 3. Fallback to Local transformers.js (Always on)
      try {
        return await localTranscribe(file)
      } catch (localError) {
        console.error("AI Transcription failed completely on all 3 providers", localError)
        throw new Error("Voice services are currently experiencing high traffic. Please try again.")
      }
    }
  }
}
