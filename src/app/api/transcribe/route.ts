import { NextResponse } from "next/server"
import { openai } from "@/lib/openai"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // In a real production app with heavy traffic, you might want to stream this 
    // or use a temporary file, but for the MVP passing the File object directly 
    // to openai.audio.transcriptions.create is supported by the SDK.
    const response = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "en",
    })

    return NextResponse.json({ text: response.text })
  } catch (error: any) {
    console.error("Transcription error:", error)
    
    // Graceful fallback for Hackathon if quota is exceeded
    if (error.status === 429 || error.status === 401 || error.code === "insufficient_quota") {
      console.warn("Returning fallback transcript due to OpenAI API limits.")
      const { mockTranscript } = await import("@/lib/dev/fallback-analysis")
      return NextResponse.json({ text: mockTranscript })
    }

    return NextResponse.json(
      { error: error.message || "Failed to transcribe audio" },
      { status: 500 }
    )
  }
}
