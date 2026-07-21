import { NextResponse } from "next/server"
import { openai } from "@/lib/openai"
import { mockAnalysis } from "@/lib/dev/fallback-analysis"
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod"

const CoachFeedbackSchema = z.object({
  score: z.number().describe("A score from 0 to 100"),
  strengths: z.array(z.string()).describe("Specific strengths found in the response"),
  weaknesses: z.array(z.string()).describe("Specific areas for improvement"),
  advice: z.string().describe("One actionable piece of advice")
})

const AnalysisSchema = z.object({
  results: z.array(z.object({
    coach: z.enum(["Clarity", "Delivery", "Confidence", "Storytelling", "Engagement", "Expert"]),
    feedback: CoachFeedbackSchema
  })).describe("An array containing exactly 6 feedback objects, one for each coach.")
})

export async function POST(req: Request) {
  try {
    const { transcript, scenarioId } = await req.json()

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 })
    }

    const systemPrompt = `You are Voxa, an elite team of 6 communication coaches analyzing a user's response to the scenario: "${scenarioId}".
    
    You must evaluate the transcript from 6 distinct perspectives:
    1. Clarity: Evaluate conciseness, jargon, confusing sentences, and logical flow.
    2. Delivery: Evaluate signs of rambling, run-on sentences, or structural pacing issues.
    3. Confidence: Evaluate filler words (um, uh), hedging phrases, and apologetic language.
    4. Storytelling: Evaluate the use of frameworks like STAR, narrative hooks, and examples.
    5. Engagement: Evaluate the response from an audience's perspective (relevance, captivation).
    6. Expert: Evaluate the technical accuracy, vocabulary, and depth for the specific scenario.
    
    Provide brutal, actionable, and specific feedback for each of the 6 coaches.`

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transcript }
      ],
      response_format: zodResponseFormat(AnalysisSchema, "analysis_results")
    })

    const parsedResult = completion.choices[0].message.parsed

    if (!parsedResult) {
      throw new Error("Failed to parse structured output")
    }

    return NextResponse.json(parsedResult)
  } catch (error: any) {
    console.error("Analysis error:", error)
    
    // Graceful fallback for Hackathon if quota is exceeded or network fails
    if (error.status === 429 || error.status === 401 || error.code === "insufficient_quota") {
      console.warn("Returning fallback mock data due to OpenAI API limits.")
      return NextResponse.json(mockAnalysis)
    }

    return NextResponse.json(
      { error: error.message || "Failed to analyze transcript" },
      { status: 500 }
    )
  }
}
