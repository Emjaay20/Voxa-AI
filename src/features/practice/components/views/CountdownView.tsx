import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CountdownViewProps {
  onComplete: () => void
}

export function CountdownView({ onComplete }: CountdownViewProps) {
  const [count, setCount] = useState(3)
  const [text, setText] = useState("3")

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1)
        setText((count - 1).toString())
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setText("Let's begin.")
      const timer = setTimeout(() => {
        onComplete()
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [count, onComplete])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.3 }}
          className="text-6xl font-bold tracking-tight text-primary"
        >
          {text}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
