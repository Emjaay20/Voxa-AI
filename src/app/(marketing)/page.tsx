"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { Section } from "@/components/layout/Section"
import { Mic, BrainCircuit, TrendingUp, ArrowRight, ShieldCheck } from "lucide-react"

export default function MarketingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Premium Backgrounds: Radial Gradient + CSS Grid + Noise */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.12),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <Container className="relative z-10">
        <Section className="flex min-h-[90vh] flex-col items-center justify-start pb-8 pt-24 md:pb-12 md:pt-36 lg:py-40 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center gap-8"
          >
            <h1 className="max-w-5xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-balance leading-[1.1]">
              Ace your next interview with AI coaching that actually teaches you.
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="max-w-2xl text-lg text-muted-foreground sm:text-xl text-balance leading-relaxed"
            >
              Practice realistic interviews, receive detailed feedback from specialized AI coaches, and improve every answer before the real interview.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
            >
              <Button size="lg" className="rounded-full px-8 shadow-sm h-12 text-base" asChild>
                <Link href="/interview">
                  Start Practicing Free <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Premium Dashboard Screenshot */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="relative mt-24 w-full max-w-6xl rounded-[32px] border border-border/50 bg-background/50 p-2 shadow-2xl backdrop-blur-sm sm:p-4"
          >
            <div className="overflow-hidden rounded-3xl border border-border/40 bg-card shadow-inner">
              <Image 
                src="/dashboard-mockup.png" 
                alt="Voxa AI Dashboard Preview" 
                width={1200} 
                height={800} 
                className="w-full object-cover"
                priority
              />
            </div>
            
            {/* Subtle glowing ring behind image */}
            <div className="absolute inset-0 -z-10 bg-primary/20 blur-[100px] rounded-full opacity-30" />
          </motion.div>

          {/* Social Proof Strip */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-28 w-full flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-muted-foreground opacity-60 md:gap-16"
          >
            <span className="flex items-center gap-2 tracking-wide"><BrainCircuit className="size-4" /> Powered by GPT-5.6</span>
            <span className="flex items-center gap-2 tracking-wide"><ShieldCheck className="size-4" /> Multi-Agent Feedback</span>
            <span className="flex items-center gap-2 tracking-wide"><svg className="size-4" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> Built with Codex</span>
            <span className="flex items-center gap-2 tracking-wide">OpenAI Build Week 2026</span>
          </motion.div>
        </Section>

        {/* Bento Grid: Outcomes */}
        <Section className="py-32">
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Engineered for growth.</h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">Stop guessing what went wrong. We break down your performance so you can focus on exactly what matters.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5 rounded-[2.5rem] border border-border/50 bg-card p-10 shadow-sm"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Mic className="size-7" />
              </div>
              <h3 className="text-2xl font-bold">Simulate Real Interviews</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Speak naturally to your AI interviewer in a zero-pressure environment. No awkward scheduling.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5 rounded-[2.5rem] border border-border/50 bg-card p-10 shadow-sm"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <BrainCircuit className="size-7" />
              </div>
              <h3 className="text-2xl font-bold">Receive Staff-Level Feedback</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                6 autonomous agents simultaneously grade your responses for clarity, confidence, and precision.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5 rounded-[2.5rem] border border-border/50 bg-card p-10 shadow-sm"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <TrendingUp className="size-7" />
              </div>
              <h3 className="text-2xl font-bold">Track Your Growth</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Review exact quotes from your answers mapped directly to actionable, brutal coaching advice.
              </p>
            </motion.div>
          </div>
        </Section>
      </Container>
    </div>
  )
}
