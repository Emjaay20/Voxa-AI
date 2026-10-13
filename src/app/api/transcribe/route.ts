import { NextResponse } from "next/server"
import { transcribeAudio } from "@/lib/ai/orchestrator"

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")
    
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "The audio file is empty" }, { status: 400 })
    }

    const text = await transcribeAudio(file)
    return NextResponse.json({ text })
  } catch (error) {
    console.error("Transcription pipeline error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to transcribe audio" },
      { status: 500 }
    )
  }
}
