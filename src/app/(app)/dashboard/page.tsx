import { DashboardOverview } from "@/features/dashboard"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <DashboardOverview user={null} sessions={[]} scenarios={[]} isLocked={true} />
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*, scenario:scenarios(*), practice_attempts(communication_metrics(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  const { data: scenarios } = await supabase
    .from('scenarios')
    .select('*')
    .order('created_at', { ascending: true })

  return <DashboardOverview user={profile} sessions={sessions || []} scenarios={scenarios || []} />
}
