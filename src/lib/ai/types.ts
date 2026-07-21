import { z } from "zod"
import { SpeechMetrics } from "../intelligence/metrics"

export const CoachFeedbackSchema = z.object({
  score: z.number().describe("A score from 0 to 100"),
  strengths: z.array(z.string()).describe("Specific strengths found in the response"),
  weaknesses: z.array(z.string()).describe("Specific areas for improvement"),
  advice: z.string().describe("One actionable piece of advice")
})

export const AnalysisSchema = z.object({
  overallScore: z.number().describe("Overall communication score from 0 to 100"),
  executiveSummary: z.string().describe("A short 'If I interviewed you tomorrow...' personalized summary highlighting their overall performance."),
  topStrengths: z.array(z.string()).max(3).describe("Top 3 strengths aggregated from all coaches."),
  topWeaknesses: z.array(z.string()).max(3).describe("Top 3 weaknesses or habits holding them back."),
  results: z.array(z.object({
    coach: z.enum(["Clarity", "Delivery", "Confidence", "Storytelling", "Engagement", "Expert"]),
    feedback: CoachFeedbackSchema
  })).describe("An array containing exactly 6 feedback objects, one for each coach.")
})

export type CoachFeedback = z.infer<typeof CoachFeedbackSchema>
export type AnalysisResult = z.infer<typeof AnalysisSchema>

export type FinalReportData = AnalysisResult & {
  metrics: SpeechMetrics
}
