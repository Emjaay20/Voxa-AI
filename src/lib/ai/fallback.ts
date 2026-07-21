import { AnalysisResult } from "./types"

export function getFallbackAnalysis(transcript: string): AnalysisResult {
  const wordCount = transcript.trim().split(/\s+/).length
  const lowerTranscript = transcript.toLowerCase()
  
  const fillerWords = ["um", "uh", "like", "actually", "basically", "you know"]
  const fillerCount = fillerWords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    const matches = lowerTranscript.match(regex)
    return count + (matches ? matches.length : 0)
  }, 0)

  let score = 80
  let strengths = ["Good general structure"]
  let weaknesses = []
  
  if (fillerCount > 5) {
    score -= 15
    weaknesses.push("Relied too heavily on filler words.")
  } else if (wordCount > 100) {
    score += 5
    strengths.push("Excellent pacing and length.")
  }

  if (wordCount < 20) {
    score -= 20
    weaknesses.push("Response was too short to fully address the scenario.")
  }

  if (weaknesses.length === 0) weaknesses.push("Could provide more specific examples.")

  return {
    overallScore: Math.max(0, Math.min(100, score)),
    executiveSummary: "You did a solid job, but there's room to improve your pacing and eliminate filler words to sound more confident.",
    topStrengths: strengths,
    topWeaknesses: weaknesses,
    results: [
      {
        coach: "Clarity",
        feedback: {
          score: score - 5,
          strengths: ["Points were generally understandable"],
          weaknesses: ["Some points could be more concise"],
          advice: "Try to state your main point first, then elaborate."
        }
      },
      {
        coach: "Delivery",
        feedback: {
          score: score,
          strengths: ["Pacing was mostly steady"],
          weaknesses: ["Occasional hesitations"],
          advice: "Take a deep breath before answering to avoid rushing."
        }
      },
      {
        coach: "Confidence",
        feedback: {
          score: fillerCount > 5 ? 60 : 85,
          strengths: ["Maintained a professional tone"],
          weaknesses: fillerCount > 5 ? ["Too many filler words"] : ["Minor hedging"],
          advice: "Replace 'um' with a silent pause."
        }
      },
      {
        coach: "Storytelling",
        feedback: {
          score: 75,
          strengths: ["Attempted to provide context"],
          weaknesses: ["Lacked a clear narrative arc"],
          advice: "Use the STAR framework for behavioral questions."
        }
      },
      {
        coach: "Engagement",
        feedback: {
          score: 80,
          strengths: ["Relevant to the prompt"],
          weaknesses: ["Could be more captivating"],
          advice: "Use vocal variety to emphasize key points."
        }
      },
      {
        coach: "Expert",
        feedback: {
          score: 82,
          strengths: ["Demonstrated baseline knowledge"],
          weaknesses: ["Could dive deeper into specifics"],
          advice: "Include one highly specific metric or technical term."
        }
      }
    ]
  }
}

export function getFallbackTranscript(): string {
  return "This is a simulated fallback transcript. The AI provider is currently unreachable or rate limited, but the system gracefully degraded to keep the demo running smoothly. In a real scenario, this text would be your actual spoken words."
}
