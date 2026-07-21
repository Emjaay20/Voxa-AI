import { PracticeSessionShell } from "@/features/practice"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

const DEFAULT_SCENARIOS = [
  {
    id: "daily-conversation",
    title: "Daily Conversation",
    description: "Practice your casual conversational flow, active listening, and natural pacing.",
    icon: "message-circle",
    status: "active",
  },
  {
    id: "storytelling",
    title: "Storytelling",
    description: "Refine your narrative structure, vocabulary richness, and emotional delivery.",
    icon: "book-open",
    status: "active",
  },
  {
    id: "expressing-opinions",
    title: "Expressing Opinions",
    description: "Practice articulating your thoughts clearly and confidently on the spot.",
    icon: "mic",
    status: "active",
  },
  {
    id: "debate-persuasion",
    title: "Debate & Persuasion",
    description: "Navigate difficult counter-arguments with empathy and authority.",
    icon: "scale",
    status: "inactive",
  }
];

export default async function PracticePage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch active scenarios
  const { data: scenarios } = await supabase
    .from('scenarios')
    .select('*')
    .order('created_at', { ascending: true })

  const finalScenarios = scenarios && scenarios.length > 0 ? scenarios : DEFAULT_SCENARIOS;

  return <PracticeSessionShell scenarios={finalScenarios} isAuthenticated={Boolean(user)} />
}
