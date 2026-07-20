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
  { id: "1", name: "Interview Coach", role: "Analyzes structure, STAR method, overall delivery.", status: "Ready", percent: 100, icon: "Target", colorClass: "text-blue-500", bgClass: "bg-blue-500/10" },
  { id: "2", name: "Grammar Coach", role: "Finds filler words, grammar issues, clarity problems.", status: "Analyzing...", percent: 45, icon: "MessageCircle", colorClass: "text-purple-500", bgClass: "bg-purple-500/10" },
  { id: "3", name: "Confidence Coach", role: "Measures hesitation, certainty, speech confidence.", status: "Waiting", percent: 0, icon: "BrainCircuit", colorClass: "text-emerald-500", bgClass: "bg-emerald-500/10" },
  { id: "4", name: "Technical Coach", role: "Reviews correctness, depth, engineering decisions.", status: "Ready", percent: 100, icon: "Code", colorClass: "text-amber-500", bgClass: "bg-amber-500/10" },
  { id: "5", name: "Conversation Coach", role: "Evaluates pacing, engagement, and active listening.", status: "Analyzing...", percent: 80, icon: "Sparkles", colorClass: "text-cyan-500", bgClass: "bg-cyan-500/10" },
  { id: "6", name: "Negotiation Coach", role: "Salary discussions, communication, positioning.", status: "Ready", percent: 100, icon: "Users", colorClass: "text-rose-500", bgClass: "bg-rose-500/10" },
]

export const mockMetrics = {
  totalInterviews: 42,
  avgScore: 8.4,
  areasForImprovement: 3,
}

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
