import { AnalysisResult } from "./types"
import { getCoachSystemPrompt } from "../prompts/coach"

export async function geminiAnalyze(transcript: string, scenarioSlug: string, previousWeaknesses?: string[], metrics?: any): Promise<AnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set")
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

  // Using simple REST fetch to avoid dependency issues
  const payload = {
    contents: [
      {
        parts: [{ text: `${systemPrompt}\n\nAnalyze the following transcript exactly matching this JSON schema:\n${schemaTemplate}\n\nTranscript:\n${transcript}` }]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      response_mime_type: "application/json"
    }
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Gemini API Error: ${response.status} ${errText}`)
  }

  const data = await response.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text
  
  if (!content) {
    throw new Error("Failed to parse Gemini response")
  }

  try {
    return JSON.parse(content) as AnalysisResult
  } catch (e) {
    throw new Error("Failed to parse Gemini JSON output")
  }
}
