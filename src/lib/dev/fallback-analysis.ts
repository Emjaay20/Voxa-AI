export const mockAnalysis = {
  overallScore: 87,
  executiveSummary: "If I interviewed you tomorrow, I'd likely move you to the next round. Your technical explanation was flawless, and you projected great confidence. However, you need to tighten up your pacing and eliminate the filler words to sound truly executive.",
  topStrengths: [
    "Flawless technical explanation with accurate industry terminology.",
    "Followed the STAR method perfectly.",
    "Projected certainty when discussing decisions."
  ],
  topWeaknesses: [
    "Used 'um' and 'like' too frequently.",
    "Sentences were too long, affecting natural breathing.",
    "The 'Situation' context took up too much time compared to the 'Action'."
  ],
  fillerWords: [
    { word: "um", count: 14 },
    { word: "like", count: 11 },
    { word: "basically", count: 5 }
  ],
  speakingPace: 145,
  results: [
    {
      coach: "Clarity",
      feedback: {
        score: 85,
        strengths: ["You presented a very clear overview of the situation without getting bogged down in irrelevant details."],
        weaknesses: ["There was some slight repetition around the middle of your response regarding the project timeline."],
        advice: "Next time, summarize the timeline in one sentence and move faster into the action you took."
      }
    },
    {
      coach: "Delivery",
      feedback: {
        score: 78,
        strengths: ["Your pacing is excellent. You didn't rush your explanation."],
        weaknesses: ["Your sentences are slightly long, which can make it hard to breathe naturally."],
        advice: "Break complex thoughts into shorter sentences. Use deliberate pauses for emphasis."
      }
    },
    {
      coach: "Confidence",
      feedback: {
        score: 92,
        strengths: ["Very few filler words. You projected certainty when discussing your decisions."],
        weaknesses: ["You used 'I think' once when you could have just stated the fact directly."],
        advice: "Replace 'I think we saved...' with 'We saved...'. Own your accomplishments."
      }
    },
    {
      coach: "Storytelling",
      feedback: {
        score: 88,
        strengths: ["You followed the STAR method perfectly, highlighting the exact result of your actions."],
        weaknesses: ["The 'Situation' part was a bit long compared to the 'Action'."],
        advice: "Spend 20% of your time on the Situation, and 80% on the Action and Result."
      }
    },
    {
      coach: "Engagement",
      feedback: {
        score: 80,
        strengths: ["You framed the problem as something the listener would care about."],
        weaknesses: ["It felt a bit like a monologue. You could pull the listener in more."],
        advice: "Try adding a rhetorical question like 'What would you have done?' to keep the listener mentally engaged."
      }
    },
    {
      coach: "Expert",
      feedback: {
        score: 95,
        strengths: ["You correctly identified the technical bottlenecks and used accurate industry terminology."],
        weaknesses: [],
        advice: "Your technical explanation was flawless. This shows you are highly competent in your domain."
      }
    }
  ]
}

export const mockTranscript = "I led the migration of our legacy database to a modern cloud infrastructure. The main issue we faced was downtime. I realized we couldn't afford a full blackout, so I proposed a phased approach. I think it worked really well because we managed to keep the system online for 99% of our users during the transition."
