import { openai } from "@/lib/openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { AnalysisSchema, AnalysisResult } from "./types"
import { getCoachSystemPrompt } from "../prompts/coach"

export async function openAIAnalyze(transcript: string, scenarioSlug: string, previousWeaknesses?: string[], metrics?: any): Promise<AnalysisResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set")
  }

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
  const response = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language: "en",
  })
  return response.text
}
