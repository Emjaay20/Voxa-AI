import * as React from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function UpcomingSession({ scenarios = [] }: { scenarios?: any[] }) {
  const activeScenarios = scenarios.filter(s => s.status === 'active')
  
  if (activeScenarios.length === 0) {
    activeScenarios.push({ id: 'general', title: 'General Practice', description: 'Available anytime' })
  }

  return (
    <div className="flex flex-col gap-6">
      {activeScenarios.map((scenario) => (
        <Link 
          key={scenario.id} 
          href={`/practice?scenarioId=${scenario.id}`}
          className="group flex flex-col gap-2 py-5 border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors px-2 -mx-2 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold tracking-tight group-hover:text-primary transition-colors">
              {scenario.title}
            </h3>
            <ArrowRight className="size-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-muted-foreground line-clamp-1">{scenario.description}</p>
        </Link>
      ))}
    </div>
  )
}
