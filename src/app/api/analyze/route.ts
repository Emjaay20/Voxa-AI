import { NextResponse } from "next/server"
import { openai } from "@/lib/openai"

const createPrompt = (coachType: string, transcript: string, scenarioId: string) => {
  let systemInstructions = ""

  switch (coachType) {
    case "Clarity":
      systemInstructions = "You are a Clarity Coach. Analyze the user's transcript. Focus on conciseness, jargon use, confusing sentences, and logical flow. Provide actionable advice to simplify their message."
      break
    case "Delivery":
      systemInstructions = "You are a Delivery Coach. Analyze the user's transcript. Since you only have text, look for signs of rambling, run-on sentences, or structural pacing issues. Provide actionable advice on energy, pauses, and tone."
      break
    case "Confidence":
      systemInstructions = "You are a Confidence Coach. Analyze the user's transcript. Look for filler words (um, uh, like), hedging phrases (I think, maybe), and apologetic language. Provide actionable advice to project certainty."
      break
    case "Storytelling":
      systemInstructions = "You are a Storytelling Coach. Analyze the user's transcript. Check if they use frameworks like STAR (Situation, Task, Action, Result). Evaluate their hooks, examples, and narrative arc. Provide actionable advice on structuring their story better."
      break
    case "Engagement":
      systemInstructions = "You are an Engagement Coach. Analyze the user's transcript from the audience's perspective. Would they be bored? Is it relevant? Provide actionable advice on making the message more captivating and audience-centric."
      break
    case "Expert":
      systemInstructions = `You are a Domain Expert Coach for the scenario: ${scenarioId}. Analyze the technical accuracy, industry-specific vocabulary, and depth of the user's response. Provide actionable advice on proving their expertise.`
      break
  }

  return {
    model: "gpt-4o-mini", // fast and capable for MVP
    messages: [
      { 
        role: "system", 
        content: `${systemInstructions}\n\nRespond strictly in the following JSON format: { "score": number (0-100), "strengths": ["string"], "weaknesses": ["string"], "advice": "string" }`
      },
      { 
        role: "user", 
        content: transcript 
      }
    ],
    response_format: { type: "json_object" }
  } as const
}

export async function POST(req: Request) {
  try {
    const { transcript, scenarioId } = await req.json()

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 })
    }

    const coaches = ["Clarity", "Delivery", "Confidence", "Storytelling", "Engagement", "Expert"]

    // Execute all 6 coach prompts concurrently
    const analysisPromises = coaches.map(async (coach) => {
      const completion = await openai.chat.completions.create(createPrompt(coach, transcript, scenarioId))
      
      const result = completion.choices[0].message.content
      const parsedResult = result ? JSON.parse(result) : null

      return {
        coach,
        feedback: parsedResult
      }
    })

    const results = await Promise.all(analysisPromises)

    return NextResponse.json({ results })
  } catch (error: any) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to analyze transcript" },
      { status: 500 }
    )
  }
}
