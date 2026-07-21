import OpenAI from "openai"
import { AnalysisSchema, AnalysisResult } from "./types"
import { getCoachSystemPrompt } from "../prompts/coach"

// Initialize an OpenAI-compatible client pointed at Groq
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
})

export async function groqAnalyze(transcript: string, scenarioSlug: string, previousWeaknesses?: string[], metrics?: any): Promise<AnalysisResult> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set")
  }

  const systemPrompt = getCoachSystemPrompt(scenarioSlug, previousWeaknesses, metrics)

  const schemaTemplate = `
{
  "overallScore": 85,
  "executiveSummary": "string",
  "topStrengths": ["string", "string", "string"],
  "topWeaknesses": ["string", "string", "string"],
  "results": [
    {
      "coach": "Clarity | Delivery | Confidence | Storytelling | Engagement | Expert",
      "feedback": {
        "score": 85,
        "strengths": ["string"],
        "weaknesses": ["string"],
        "advice": "string"
      }
    }
  ]
}`

  // Use chat.completions.create with json_object
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: `${systemPrompt}\n\nYou must respond ONLY with a JSON object matching this schema:\n${schemaTemplate}` },
      { role: "user", content: `Please analyze this transcript:\n\n${transcript}` }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  })

  const rawJson = completion.choices[0]?.message?.content
  if (!rawJson) {
    throw new Error("Groq analysis failed: No JSON content returned")
  }
  
  return JSON.parse(rawJson) as AnalysisResult
}

export async function groqTranscribe(file: File): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set")
  }

  const response = await groq.audio.transcriptions.create({
    file,
    model: "whisper-large-v3-turbo",
    language: "en",
    response_format: "json",
  })
  return response.text
}
