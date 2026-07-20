export const mockUser = {
  name: "Sarah",
  role: "Senior Product Manager",
  avatarUrl: "https://i.pravatar.cc/150?u=sarah",
  level: 6,
  interviewsToNextLevel: 8,
  streakDays: 12,
}

export const mockInsight = {
  title: "Today's Insight",
  text: "You interrupt yourself 17% less than last week. Confidence improved by 12%. Keep slowing down before answering.",
}

export const mockUpcomingInterview = {
  company: "Google",
  role: "SWE",
  day: "Friday",
  time: "10:00 AM",
}

export const mockCoaches = [
  { id: "1", name: "Communication Coach", role: "Simplifies ideas, finds confusing sentences, clarity.", status: "Ready", percent: 100, icon: "MessageCircle", colorClass: "text-blue-500", bgClass: "bg-blue-500/10" },
  { id: "2", name: "Delivery Coach", role: "Analyzes pace, energy, pauses, and vocal tone.", status: "Analyzing...", percent: 45, icon: "Mic", colorClass: "text-purple-500", bgClass: "bg-purple-500/10" },
  { id: "3", name: "Confidence Coach", role: "Measures filler words, certainty, and presence.", status: "Waiting", percent: 0, icon: "BrainCircuit", colorClass: "text-emerald-500", bgClass: "bg-emerald-500/10" },
  { id: "4", name: "Storytelling Coach", role: "Evaluates narrative, examples, hooks, and structure.", status: "Ready", percent: 100, icon: "Sparkles", colorClass: "text-amber-500", bgClass: "bg-amber-500/10" },
  { id: "5", name: "Listener Coach", role: "Audience perspective: 'This part was confusing.'", status: "Analyzing...", percent: 80, icon: "Users", colorClass: "text-cyan-500", bgClass: "bg-cyan-500/10" },
  { id: "6", name: "Domain Expert", role: "Technical accuracy, scenario-specific requirements.", status: "Ready", percent: 100, icon: "Code", colorClass: "text-rose-500", bgClass: "bg-rose-500/10" },
]

export const mockMetrics = {
  totalInterviews: 12,
  averageScore: 84,
  streakDays: 12,
}

export const mockInterviews = [
  {
    id: "1",
    title: "Google SWE Interview",
    date: "2026-07-19",
    score: 88,
    duration: "45 min",
    type: "Technical",
    improvements: ["System Design clarity", "STAR method structure"]
  },
  {
    id: "2",
    title: "Stripe Product Manager",
    date: "2026-07-18",
    score: 92,
    duration: "30 min",
    type: "Behavioral",
    improvements: ["More concise answers"]
  },
  {
    id: "3",
    title: "Q3 Sales Pitch Demo",
    date: "2026-07-15",
    score: 76,
    duration: "60 min",
    type: "Presentation",
    improvements: ["Objection handling", "Closing confidence"]
  }
]

export const mockPerformanceData = [
  { month: "Jan", confidence: 3, clarity: 3 },
  { month: "Feb", confidence: 5, clarity: 7 },
  { month: "Mar", confidence: 4.2, clarity: 6 },
  { month: "Apr", confidence: 8, clarity: 5.2 },
  { month: "May", confidence: 6, clarity: 8.5 },
  { month: "Jun", confidence: 9.5, clarity: 7 },
]

export const mockRecentInterviews = [
  {
    id: "1",
    role: "Meta Product Manager",
    date: "June 18, 2026",
    score: 9.2,
    status: "Completed",
  },
  {
    id: "2",
    role: "Stripe SWE",
    date: "June 14, 2026",
    score: 8.8,
    status: "Completed",
  },
  {
    id: "3",
    role: "Vercel Frontend Engineer",
    date: "June 10, 2026",
    score: 7.5,
    status: "Needs Review",
  },
]
