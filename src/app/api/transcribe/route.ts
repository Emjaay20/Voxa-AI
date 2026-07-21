import { NextResponse } from "next/server"
import { transcribeAudio } from "@/lib/ai/orchestrator"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    const text = await transcribeAudio(file)
    return NextResponse.json({ text })
  } catch (error: any) {
    console.error("Transcription pipeline error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to transcribe audio" },
      { status: 500 }
    )
  }
}
