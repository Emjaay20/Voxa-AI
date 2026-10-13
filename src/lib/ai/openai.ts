import { getOpenAIClient } from "@/lib/openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { AnalysisSchema, AnalysisResult } from "./types"
import { getCoachSystemPrompt } from "../prompts/coach"

export async function openAIAnalyze(transcript: string, scenarioSlug: string, previousWeaknesses?: string[], metrics?: any): Promise<AnalysisResult> {
  const openai = getOpenAIClient()
  const completion = await openai.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: getCoachSystemPrompt(scenarioSlug, previousWeaknesses, metrics) },
      { role: "user", content: transcript }
    ],
    response_format: zodResponseFormat(AnalysisSchema, "analysis_results")
  })

  const parsedResult = completion.choices[0].message.parsed
  if (!parsedResult) {
    throw new Error("OpenAI failed to parse structured output")
  }

  return parsedResult
}

export async function openAITranscribe(file: File): Promise<string> {
  const openai = getOpenAIClient()
  const response = await openai.audio.transcriptions.create({
    file,
    model: process.env.OPENAI_TRANSCRIPTION_MODEL || "whisper-1",
    language: "en",
  })

  if (!response.text?.trim()) {
    throw new Error("OpenAI transcription returned empty text")
  }

  return response.text
}
