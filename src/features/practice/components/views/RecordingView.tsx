import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mic, Square } from "lucide-react"

interface RecordingViewProps {
  onFinish: () => void
}

export function RecordingView({ onFinish }: RecordingViewProps) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full w-full flex-col items-center justify-center max-w-4xl mx-auto"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
        <span className="text-sm font-semibold tracking-widest text-primary uppercase mb-6">Question 1 of 5</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-balance">
          Tell me about a time you had to lead a project without formal authority.
        </h2>
      </div>

      <div className="mt-12 w-full flex flex-col items-center gap-8 bg-background/50 backdrop-blur-sm border border-border/50 rounded-[32px] p-8 shadow-sm">
        
        {/* Fake Waveform Animation */}
        <div className="flex items-center justify-center gap-1 h-12">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-primary rounded-full"
              animate={{ height: ["20%", "100%", "20%"] }}
              transition={{
                duration: 0.8 + Math.random() * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 text-muted-foreground font-mono">
          <div className="size-2 rounded-full bg-red-500 animate-pulse" />
          {formatTime(seconds)}
        </div>

        <Button size="lg" variant="destructive" className="rounded-full h-14 px-8 text-base shadow-lg" onClick={onFinish}>
          <Square className="mr-2 size-5 fill-current" /> Finish Answering
        </Button>
      </div>
    </motion.div>
  )
}
