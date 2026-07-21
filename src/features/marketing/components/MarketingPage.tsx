"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Mic,
  Sparkle,
  TrendingUp,
  MessagesSquare,
  Check,
  Star,
} from "lucide-react";

export function MarketingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <ReportPreview />
      <Features />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ---------- Nav ---------- */
function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-primary-foreground">
            <Sparkle className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          <span className="font-serif text-xl leading-none">Voxa</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
          <Link href="#features" className="hover:text-ink transition-colors">Features</Link>
          <Link href="#how" className="hover:text-ink transition-colors">How it works</Link>
        </nav>
        <div className="flex items-center gap-1">
          <Link href="/login" className="btn-ghost hidden sm:inline-flex">Sign in</Link>
          <Link href="/practice" className="btn-primary">
            Start practicing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="mb-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-ink-muted">
            <span className="h-px w-8 bg-ink/25" />
            <span>Vol. 01 — The Practice Studio</span>
            <span className="h-px w-8 bg-ink/25" />
          </div>
          <h1 className="font-serif text-5xl leading-[1.02] text-ink md:text-7xl">
            Become the
            <br />
            communicator
            <br />
            <em className="italic">people remember.</em>
          </h1>
          <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-ink-muted md:text-base">
            Practice every important conversation before it happens. Get instant,
            specialist-level feedback from a team of AI coaches trained to sharpen your
            clarity, confidence, and impact.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/practice" className="btn-primary">
              Start practicing free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ReportView } from "@/features/practice/components/views/ReportView";

const mockReportData = {
  overallScore: 72,
  executiveSummary: "The candidate demonstrates self-awareness and a willingness to improve, but struggles with clarity, delivery, and confidence. With practice and refinement, they can enhance their communication skills.",
  metrics: {
    speakingConfidence: 89,
    wordsPerMinute: 107,
    fillerWordsCount: 4,
    fillerWords: [{ word: "like", count: 1 }],
    vocabularyRichness: 62,
    averageSentenceLength: 16
  },
  topStrengths: [
    "Self-awareness and willingness to improve",
    "Attempt to structure a short-term goal (30 seconds) to assess performance",
    "Acknowledgment of the importance of spoken vocabulary"
  ],
  topWeaknesses: [
    "Inability to maintain a filler-word-free conversation even for a short duration",
    "Lack of clarity and coherence in the message",
    "Insufficient confidence in speech, evident from the use of filler words and hesitant tone"
  ],
  results: [
    {
      coach: "Clarity Coach",
      feedback: {
        score: 60,
        advice: "Focus on creating a clear, concise message before speaking. Practice outlining your thoughts to improve logical flow and reduce confusion."
      }
    },
    {
      coach: "Delivery Coach",
      feedback: {
        score: 70,
        advice: "Work on pacing by practicing speeches or presentations. Record yourself to identify areas where you can improve your delivery and reduce filler words."
      }
    },
    {
      coach: "Confidence Coach",
      feedback: {
        score: 65,
        advice: "Practice assertive speech by recording yourself and focusing on reducing filler words. Use positive self-talk to boost confidence before speaking."
      }
    },
    {
      coach: "Storytelling Coach",
      feedback: {
        score: 55,
        advice: "Develop your storytelling skills by creating engaging narratives with clear beginnings, middles, and ends. Use the STAR method to structure your stories and make them more relatable."
      }
    },
    {
      coach: "Engagement Coach",
      feedback: {
        score: 70,
        advice: "Work on making your message more engaging by varying your tone, using rhetorical questions, and incorporating personal anecdotes to capture the audience's interest."
      }
    },
    {
      coach: "Expert Coach",
      feedback: {
        score: 75,
        advice: "Expand your technical vocabulary by reading industry publications and practicing discussions on various topics. Focus on providing in-depth insights to demonstrate your expertise."
      }
    }
  ]
};

/* ---------- Report preview ---------- */
function ReportPreview() {
  return (
    <section className="relative pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-line/60 bg-background shadow-[0_40px_120px_-40px_oklch(0.14_0.008_60/0.15)] ring-1 ring-ink/5">
          {/* Top Bar for Mockup UI */}
          <div className="h-12 w-full bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2">
            <div className="size-3 rounded-full bg-rose-500/80" />
            <div className="size-3 rounded-full bg-amber-500/80" />
            <div className="size-3 rounded-full bg-emerald-500/80" />
            <div className="mx-auto h-6 w-64 bg-background rounded-md border border-border/50 shadow-sm flex items-center justify-center text-[10px] text-muted-foreground font-medium">voxa.ai/report/demo</div>
          </div>
          <div 
            className="relative w-full h-[500px] md:h-[700px] lg:h-[800px] bg-background px-4 md:px-12 overflow-hidden pointer-events-none"
            style={{
              maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            }}
          >
            <div className="scale-[0.8] md:scale-90 lg:scale-100 origin-top flex justify-center w-full">
              <ReportView 
                reportData={mockReportData} 
                onFinish={() => {}} 
                isGuest={true} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ---------- Logos ---------- */
function LogoRow() {
  const items = [
    "Powered by GPT-5.6",
    "Multi-agent feedback",
    "Built with Codex",
    "OpenAI Build Week 2026",
  ];
  return (
    <section className="border-y border-line/70 bg-surface/60 py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-3 px-6 text-xs text-ink-muted">
        {items.map((i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <Sparkle className="h-3 w-3" />
            {i}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------- Features ---------- */
function Features() {
  const items = [
    {
      icon: <Mic className="h-5 w-5" />,
      title: "Simulate high-stakes scenarios",
      desc: "Rehearse job interviews, board pitches, and hard 1:1s in a private, zero-pressure environment.",
    },
    {
      icon: <MessagesSquare className="h-5 w-5" />,
      title: "Specialist-level feedback",
      desc: "Six autonomous agents grade clarity, confidence, structure, and storytelling in parallel.",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Track your growth",
      desc: "Get exact quotes from your answers mapped to actionable, unflinching coaching advice.",
    },
  ];
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">Product</p>
          <h2 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
            Engineered for <em className="italic">growth.</em>
          </h2>
          <p className="mt-4 text-ink-muted">
            Stop guessing what went wrong. We break down your communication so you can focus on
            exactly what matters.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((it) => (
            <article
              key={it.title}
              className="group relative rounded-2xl border border-line bg-card p-7 transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-30px_oklch(0.14_0.008_60/0.1)]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-primary-foreground">
                {it.icon}
              </span>
              <h3 className="mt-6 font-serif text-2xl text-ink">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{it.desc}</p>
              <ArrowUpRight className="absolute right-6 top-6 h-4 w-4 text-ink-muted opacity-0 transition group-hover:opacity-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Pick your scenario",
      desc: "Choose from job interviews, sales pitches, executive updates, or upload your own brief.",
    },
    {
      n: "02",
      title: "Speak, live",
      desc: "Voxa records and transcribes your session while six specialist agents listen in parallel.",
    },
    {
      n: "03",
      title: "Get a debrief",
      desc: "Receive a written report card with quotes, scores, and drills tailored to your next attempt.",
    },
  ];
  return (
    <section id="how" className="border-t border-line/70 bg-surface/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">How it works</p>
            <h2 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
              Three steps. <br />
              <em className="italic">Zero fluff.</em>
            </h2>
          </div>
          <p className="text-ink-muted md:text-lg">
            A calm, private studio to rehearse the moments that shape your career — with feedback
            that reads like a senior coach, not a scoring rubric.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="bg-card p-8">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl text-accent">{s.n}</span>
                <span className="h-px w-14 bg-line" />
              </div>
              <h3 className="mt-5 font-serif text-2xl text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonial ---------- */
function Testimonial() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 flex items-center justify-center gap-1 text-accent">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <blockquote className="font-serif text-3xl leading-snug text-ink md:text-5xl">
          “Voxa is the closest thing I've had to a private communication coach.
          I walked into my Series B pitch <em className="italic">calm, sharp, and prepared.</em>”
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className="grid h-10 w-10 place-items-center rounded-full font-medium text-primary-foreground"
            style={{ background: "oklch(0.55 0.14 30)" }}
          >
            MR
          </span>
          <div className="text-left text-sm">
            <div className="text-ink">Maya Reyes</div>
            <div className="text-ink-muted">Founder & CEO, Kindred</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Stats ---------- */
function Stats() {
  const stats = [
    { v: "4,200+", l: "Professionals coached" },
    { v: "8.4/10", l: "Average clarity score" },
    { v: "6", l: "Specialist AI agents" },
    { v: "92%", l: "Report more confidence" },
  ];
  return (
    <section className="border-y border-line/70 bg-surface/60 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="font-serif text-4xl text-ink md:text-5xl">{s.v}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.15em] text-ink-muted">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center text-primary-foreground md:px-16 md:py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at 20% 0%, oklch(0.82 0.14 158 / 0.25), transparent 60%), radial-gradient(ellipse at 100% 100%, oklch(0.7 0.16 300 / 0.2), transparent 60%)",
            }}
          />
          <div className="relative">
            <h2 className="font-serif text-4xl leading-tight md:text-6xl">
              Your next conversation
              <br />
              <em className="italic text-mint">deserves practice.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm text-[oklch(0.8_0.01_60)] md:text-base">
              Start free. No card required. Rehearse your first scenario in under two minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-ink transition hover:-translate-y-0.5"
              >
                Start practicing free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-primary-foreground transition hover:bg-white/5"
              >
                Sign In
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[oklch(0.75_0.01_60)]">
              {["Free forever plan", "Private by default", "Cancel anytime"].map((i) => (
                <li key={i} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-mint" /> {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="border-t border-line/70 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-primary-foreground">
              <Sparkle className="h-3 w-3" strokeWidth={2.5} />
            </span>
            <span className="font-serif text-lg">Voxa</span>
          </div>
          <span className="text-xs text-ink-muted">
            © {new Date().getFullYear()} Voxa Labs, Inc.
          </span>
          <span className="text-xs text-ink-muted">
            Built by <a href="https://github.com/Emjaay20" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors underline underline-offset-2">Yusuf Abubakar</a>
          </span>
        </div>
        <div className="flex flex-col md:items-end gap-2 text-sm text-ink-muted">
          <span className="text-xs">Built with Next.js and Tailwind CSS</span>
          <a href="https://github.com/Emjaay20/Voxa-AI" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-ink transition-colors underline underline-offset-2">
            Code available on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
