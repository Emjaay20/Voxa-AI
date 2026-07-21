import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { analyzeCommunication } from "@/lib/ai/orchestrator"
import { createClient } from "@/utils/supabase/server"

const GUEST_ANALYSIS_COOKIE = "voxa_guest_analysis_used"
const GUEST_ANALYSIS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()

    if (process.env.NODE_ENV !== "development" && cookieStore.has(GUEST_ANALYSIS_COOKIE)) {
      return NextResponse.json(
        { error: "You've used your free coaching report. Create an account to continue practicing." },
        { status: 403 }
      )
    }

    const { transcript, scenarioId, durationSeconds } = await req.json()

    if (!transcript || !scenarioId) {
      return NextResponse.json(
        { error: "A transcript and scenario are required." },
        { status: 400 }
      )
    }

    const supabase = createClient(cookieStore)
    const { data: scenario } = await supabase
      .from("scenarios")
      .select("slug")
      .eq("id", scenarioId)
      .single()

    const analysis = await analyzeCommunication(
      transcript,
      scenario?.slug || "job-interview",
      durationSeconds || 60
    )

    const response = NextResponse.json({ ...analysis, isGuest: true })
    response.cookies.set(GUEST_ANALYSIS_COOKIE, "true", {
      httpOnly: true,
      maxAge: GUEST_ANALYSIS_COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    return response
  } catch (error: unknown) {
    console.error("Guest analysis pipeline error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "Failed to analyze your practice session."
      },
      { status: 500 }
    )
  }
}
