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
  { id: "1", name: "Interview Coach", status: "Ready", percent: 100, icon: "Target" },
  { id: "2", name: "Grammar Coach", status: "Analyzing...", percent: 45, icon: "MessageCircle" },
  { id: "3", name: "Confidence Coach", status: "Waiting", percent: 0, icon: "BrainCircuit" },
  { id: "4", name: "Technical Coach", status: "Ready", percent: 100, icon: "Code" },
  { id: "5", name: "Clarity Coach", status: "Analyzing...", percent: 80, icon: "Sparkles" },
  { id: "6", name: "Behavioral Coach", status: "Ready", percent: 100, icon: "Users" },
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
