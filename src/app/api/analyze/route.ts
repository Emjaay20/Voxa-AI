import { NextResponse } from "next/server"
import { analyzeCommunication } from "@/lib/ai/orchestrator"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { transcript, scenarioId, durationSeconds, sessionId: existingSessionId } = await req.json()

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const guestPractices = cookieStore.get('guest_practices')
      if (guestPractices && parseInt(guestPractices.value) >= 1) {
        return NextResponse.json(
          { error: "You've used your free session! Please create an account to unlock unlimited practice." },
          { status: 403 }
        )
      }
    }

    // 1. Fetch Scenario Slug
    const { data: scenario } = await supabase.from('scenarios').select('slug, title').eq('id', scenarioId).single()
    const scenarioSlug = scenario?.slug || 'job-interview'

    // 2. Fetch AI Memory (Last weaknesses for this scenario by this user)
    let previousWeaknesses: string[] = []
    if (user) {
      const { data: pastAttempts } = await supabase
        .from('practice_attempts')
        .select(`
          id,
          sessions!inner(user_id, scenario_id)
        `)
        .eq('sessions.user_id', user.id)
        .eq('sessions.scenario_id', scenarioId)
        .order('created_at', { ascending: false })
        .limit(1)
        
      if (pastAttempts && pastAttempts.length > 0) {
        const lastAttemptId = pastAttempts[0].id
        const { data: pastFeedback } = await supabase
          .from('coach_feedback')
          .select('weaknesses')
          .eq('attempt_id', lastAttemptId)
          .limit(3)
        
        if (pastFeedback) {
          // Flat map all weaknesses and pick top 3
          const allWeaknesses = pastFeedback.flatMap(f => f.weaknesses)
          // filter out empties
          previousWeaknesses = allWeaknesses.filter(Boolean).slice(0, 3)
        }
      }
    }

    const analysis = await analyzeCommunication(transcript, scenarioSlug, durationSeconds || 60, previousWeaknesses)

    let finalSessionId = existingSessionId
    let attemptNumber = 1

    if (user) {
      if (finalSessionId) {
        // Reuse session for "Try Again"
        const { data: pastSessionAttempts } = await supabase
          .from('practice_attempts')
          .select('attempt_number')
          .eq('session_id', finalSessionId)
          .order('attempt_number', { ascending: false })
          .limit(1)
        
        attemptNumber = (pastSessionAttempts?.[0]?.attempt_number || 0) + 1
      } else {
        // Create new session
        const { data: session, error: sessionError } = await supabase.from('sessions').insert({
          user_id: user.id,
          scenario_id: scenarioId,
          title: scenario?.title || 'Practice Session',
          overall_score: analysis.overallScore,
          ai_summary: analysis.executiveSummary
        }).select().single()
        
        if (!sessionError && session) {
          finalSessionId = session.id
        }
      }

      if (finalSessionId) {
        // Save practice attempt
        const { data: attempt, error: attemptError } = await supabase.from('practice_attempts').insert({
          session_id: finalSessionId,
          attempt_number: attemptNumber,
          transcript: transcript,
          duration: durationSeconds || 60,
          overall_score: analysis.overallScore
        }).select().single()

        if (!attemptError && attempt) {
          // Save communication metrics
          const words = Math.round(analysis.metrics.wordsPerMinute * ((durationSeconds || 60) / 60))
          await supabase.from('communication_metrics').insert({
            attempt_id: attempt.id,
            words: words,
            wpm: analysis.metrics.wordsPerMinute,
            filler_words: analysis.metrics.fillerWords,
            confidence: analysis.results.find((r: any) => r.coach === 'Confidence')?.feedback.score || 0,
            clarity: analysis.results.find((r: any) => r.coach === 'Clarity')?.feedback.score || 0,
            delivery: analysis.results.find((r: any) => r.coach === 'Delivery')?.feedback.score || 0,
            storytelling: analysis.results.find((r: any) => r.coach === 'Storytelling')?.feedback.score || 0,
            engagement: analysis.results.find((r: any) => r.coach === 'Engagement')?.feedback.score || 0,
            expertise: analysis.results.find((r: any) => r.coach === 'Expert')?.feedback.score || 0,
          })

          // Save coach feedback
          const feedbackEntries = analysis.results.map((r: any) => ({
            attempt_id: attempt.id,
            coach: r.coach,
            score: r.feedback.score,
            strengths: r.feedback.strengths,
            weaknesses: r.feedback.weaknesses,
            advice: r.feedback.advice,
          }))
          await supabase.from('coach_feedback').insert(feedbackEntries)
        } else {
          console.error("Failed to save practice attempt:", attemptError)
        }
      }
    }

    const response = NextResponse.json({
      ...analysis,
      sessionId: finalSessionId,
      attemptNumber
    })

    if (!user) {
      response.cookies.set('guest_practices', '1', { maxAge: 60 * 60 * 24 * 30 }) // 30 days
    }

    return response
    
  } catch (error: any) {
    console.error("Analysis pipeline error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to analyze transcript" },
      { status: 500 }
    )
  }
}
