import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Video, Mic, Settings2 } from "lucide-react"

interface SetupViewProps {
  onStart: () => void
}

export function SetupView({ onStart }: SetupViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex max-w-md flex-col items-center justify-center text-center"
    >
      <div className="mb-8 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Video className="size-8" />
      </div>
      
      <h1 className="mb-2 text-3xl font-bold tracking-tight">System Check</h1>
      <p className="mb-8 text-muted-foreground text-balance">
        Your camera and microphone are connected. Ensure you are in a quiet environment before beginning the practice session.
      </p>

      <div className="flex w-full flex-col gap-3">
        <Button size="lg" className="h-12 w-full rounded-full text-base font-semibold" onClick={onStart}>
          Start Interview
        </Button>
        <div className="flex justify-between gap-3">
          <Button variant="outline" className="h-12 flex-1 rounded-full text-muted-foreground">
            <Mic className="mr-2 size-4" /> Test Mic
          </Button>
          <Button variant="outline" className="h-12 flex-1 rounded-full text-muted-foreground">
            <Settings2 className="mr-2 size-4" /> Settings
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
