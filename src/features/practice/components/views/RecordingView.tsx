import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Square, Loader2 } from "lucide-react"

interface RecordingViewProps {
  onFinish: (transcript: string, durationSeconds: number) => void
}

export function RecordingView({ onFinish }: RecordingViewProps) {
  const [seconds, setSeconds] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    let isMounted = true

    // Start Timer
    const timer = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    // Initialize MediaRecorder
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      // If the component unmounted while we were waiting for permissions,
      // immediately stop the tracks and discard the stream.
      if (!isMounted) {
        stream.getTracks().forEach(track => track.stop())
        return
      }

      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        // Clean up tracks immediately so the microphone indicator turns off
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
        await handleTranscription(audioBlob)
      }

      mediaRecorder.start()
    }).catch(err => {
      if (!isMounted) return
      console.error("Microphone access denied or error:", err)
      // Fallback for testing if no mic
      setIsProcessing(true)
      setTimeout(() => onFinish("I didn't actually record anything because microphone access failed, but this is a fallback transcript.", seconds), 2000)
    })

    return () => {
      isMounted = false
      clearInterval(timer)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [onFinish])

  const handleTranscription = async (blob: Blob) => {
    setIsProcessing(true)
    const formData = new FormData()
    // Append a standard file name
    formData.append("file", blob, "recording.webm")

    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      // Vercel may return an HTML error page (e.g., 404) which breaks JSON parsing.
      // Guard against that by checking the response type before calling .json().
      let data: any = {}
      const contentType = res.headers.get("content-type") || ""
      if (!res.ok) {
        // Non‑2xx response – read as text for debugging and surface a clear error.
        const errorText = await res.text()
        console.error("Transcription API error:", res.status, errorText)
        onFinish(`Transcription failed (status ${res.status}).`, seconds)
        return
      }
      if (contentType.includes("application/json")) {
        data = await res.json()
      } else {
        // Unexpected content – likely an HTML error page.
        const raw = await res.text()
        console.error("Unexpected non‑JSON response from transcribe API:", raw)
        onFinish("Transcription failed: server returned unexpected response.", seconds)
        return
      }
      if (data?.text) {
        onFinish(data.text, seconds)
      } else {
        onFinish("Transcription failed to return text.", seconds)
      }
    } catch (error) {
      console.error(error)
      onFinish("An error occurred during transcription.", seconds)
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleStopClick = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full w-full flex-col items-center justify-center max-w-4xl mx-auto"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
        <span className="text-sm font-semibold tracking-widest text-primary uppercase mb-6">Question 1 of 5</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-balance mb-4">
          Tell me about a time you had to lead a project without formal authority.
        </h2>
        <p className="text-muted-foreground font-medium text-lg">
          Please speak clearly for about 30 seconds to get the best AI analysis.
        </p>
      </div>

      <div className="mt-12 w-full flex flex-col items-center gap-8 bg-background/50 backdrop-blur-sm border border-border/50 rounded-[32px] p-8 shadow-sm">
        
        {/* Fake Waveform Animation */}
        {!isProcessing && (
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
        )}

        {isProcessing && (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Transcribing audio...</p>
          </div>
        )}

        {!isProcessing && (
          <div className="flex items-center gap-4 text-muted-foreground font-mono">
            <div className="size-2 rounded-full bg-red-500 animate-pulse" />
            {formatTime(seconds)}
          </div>
        )}

        <Button 
          size="lg" 
          variant={isProcessing ? "outline" : "destructive"} 
          className="rounded-full h-14 px-8 text-base shadow-lg" 
          onClick={handleStopClick}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : (
            <><Square className="mr-2 size-5 fill-current" /> Finish Answering</>
          )}
        </Button>
      </div>
    </motion.div>
  )
}
