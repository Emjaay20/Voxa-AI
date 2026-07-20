"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Mic, BrainCircuit, TrendingUp, ArrowRight } from "lucide-react"

export default function MarketingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_50%)]" />
      </div>

      <Container className="relative z-10">
        <Section className="flex min-h-[85vh] flex-col items-center justify-center pb-8 pt-24 md:pb-12 md:pt-32 lg:py-32 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-balance">
              The interview coach you wish you always had.
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="max-w-2xl text-lg text-muted-foreground sm:text-xl text-balance leading-relaxed"
            >
              Practice with autonomous AI specialists. Get brutal, evidence-backed feedback. Land the job.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
            >
              <Button size="lg" className="rounded-full px-8 shadow-sm h-12 text-base" asChild>
                <Link href="/interview">
                  Start Your Interview <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full px-8 h-12 text-base" asChild>
                <Link href="/demo">Watch Demo</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Social Proof Strip */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-24 w-full flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-muted-foreground opacity-60 md:gap-16"
          >
            <span className="flex items-center gap-2 tracking-wide"><BrainCircuit className="size-4" /> Powered by GPT-5.6</span>
            <span className="flex items-center gap-2 tracking-wide"><svg className="size-4" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> Built with Codex</span>
            <span className="flex items-center gap-2 tracking-wide">OpenAI Build Week 2026</span>
          </motion.div>
        </Section>

        {/* Bento Grid: How It Works */}
        <Section className="py-24">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-4 text-lg text-muted-foreground">Three steps to interview mastery.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 rounded-3xl border border-border/50 bg-card p-8 shadow-sm"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Mic className="size-6" />
              </div>
              <h3 className="text-xl font-bold">1. Practice</h3>
              <p className="text-muted-foreground leading-relaxed">
                Speak naturally to your AI interviewer in a zero-pressure environment. No awkward scheduling.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 rounded-3xl border border-border/50 bg-card p-8 shadow-sm"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <BrainCircuit className="size-6" />
              </div>
              <h3 className="text-xl font-bold">2. Analyze</h3>
              <p className="text-muted-foreground leading-relaxed">
                6 autonomous agents simultaneously grade your responses for clarity, confidence, and precision.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 rounded-3xl border border-border/50 bg-card p-8 shadow-sm"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <TrendingUp className="size-6" />
              </div>
              <h3 className="text-xl font-bold">3. Improve</h3>
              <p className="text-muted-foreground leading-relaxed">
                Review exact quotes from your answers mapped directly to actionable, brutal coaching advice.
              </p>
            </motion.div>
          </div>
        </Section>
      </Container>
    </div>
  )
}
