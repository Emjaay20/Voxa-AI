import * as React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Briefcase, Presentation, Users, Megaphone, Mic, GraduationCap, Scale, BookOpen, University, MessageCircle } from "lucide-react"
import { cn } from "@/lib/cn"

const iconMap: Record<string, any> = {
  'briefcase': Briefcase,
  'presentation': Presentation,
  'chart': Megaphone,
  'users': Users,
  'mic': Mic,
  'graduation-cap': GraduationCap,
  'scale': Scale,
  'book-open': BookOpen,
  'university': University,
  'message-circle': MessageCircle,
}

interface ScenarioSelectionViewProps {
  scenarios: any[]
  onSelect: (scenarioId: string) => void
}

export function ScenarioSelectionView({ scenarios = [], onSelect }: ScenarioSelectionViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-5xl flex-col gap-10 pb-12"
    >
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Choose a Communication Challenge</h2>
        <p className="text-lg text-muted-foreground">Select a scenario to configure your AI coaching team.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {scenarios.map((scenario) => {
          const Icon = iconMap[scenario.icon] || Briefcase
          const locked = scenario.status !== 'active'
          
          return (
            <Card 
              key={scenario.id} 
              onClick={() => !locked && onSelect(scenario.id)}
              className={cn(
                "group relative overflow-hidden rounded-[24px] border-border/40 p-6 transition-all",
                locked 
                  ? "bg-muted/30 cursor-not-allowed opacity-70" 
                  : "bg-card shadow-sm hover:border-primary/30 hover:shadow-md cursor-pointer"
              )}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className={cn("flex size-12 items-center justify-center rounded-2xl", "bg-primary/10", "text-primary")}>
                    <Icon className="size-6" />
                  </div>
                  {locked && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded-full">Coming Soon</span>
                  )}
                </div>
                
                <div>
                  <h3 className="text-xl font-bold tracking-tight mb-1">{scenario.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{scenario.description}</p>
                </div>
              </div>

              {/* Hover effect for unlocked cards */}
              {!locked && (
                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/10 rounded-[24px] transition-colors pointer-events-none" />
              )}
            </Card>
          )
        })}
      </div>
    </motion.div>
  )
}
