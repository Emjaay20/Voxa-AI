# Voxa: The AI Communication Coach

Voxa is a world-class AI communication coach designed to help you become the communicator people remember. It doesn't just evaluate you; it actively teaches you how to improve your speaking pace, confidence, storytelling, and clarity in real-time.

Built during the **OpenAI Build Week**.

## 🚀 The Vision

Voxa started as an "AI Mock Interview App," but we quickly realized that interviews are just one specific application of a much broader skill: **Communication**.

Whether it's a presentation, a podcast, a sales pitch, or a difficult conversation, people want to sound confident, eliminate filler words ("um," "like"), and tell compelling stories. 

Voxa transforms the traditional feedback loop:
Instead of: `You speak → AI grades you → End`
Voxa does: `You speak → AI coaches you → You try again immediately → AI proves you improved`

## ✨ Signature Feature: "Try That Again"

The core magic of Voxa is the **Growth Loop**. After your first attempt, Voxa provides a Premium Report with an Overall Score, an Executive Verdict, and actionable feedback from 6 specialized AI coaches. 

But it doesn't stop there. 

You hit **"Try That Again"**, re-record your answer applying the feedback, and Voxa generates a **Growth Report** comparing your attempts side-by-side (`72 ─────────► 87`). It explicitly highlights how many filler words you eliminated and how your confidence score spiked. 

This proves Voxa isn't an evaluator—it's a coach that teaches you.

## 🏗️ Architecture & AI Integration

**Resilient Multi‑Provider AI Pipeline**

Voxa is designed to remain operational even when one AI provider becomes unavailable. The orchestration pipeline follows this sequence:

1. **OpenAI Whisper** transcribes recorded audio.
2. **OpenAI GPT‑4o‑mini** analyzes the transcript using Structured Outputs and generates coaching feedback.
3. If OpenAI is unavailable, rate‑limited, or experiences a service disruption, the orchestrator automatically retries the request using **Google Gemini**.
4. If Gemini is also unavailable, the request falls back to **Groq**.
5. If every external provider fails, Voxa returns a realistic **local mock response** so the application remains fully demonstrable.

This engineering‑focused design demonstrates reliable fallback handling and ensures the demo never breaks.

## 🤖 Built with Codex & GPT‑5.6

**Primary AI assistants:** Codex and GPT‑5.6 served as the principal architecture and implementation collaborators throughout development.

**Roles and contributions:**
- Product architecture and database schema design
- AI orchestration and prompt engineering
- Structured Output schema definition
- Core component refactoring and UI improvements
- Performance optimization and debugging of complex issues

**Supporting tooling:** Development primarily took place in Google’s Antigravity IDE using its GPT OSS integration, with GitHub Copilot assisting on inline implementation tasks. These productivity tools complemented the primary Codex/GPT‑5.6 workflow without diluting the core narrative.

## 🤖 Built with Codex & GPT-5.6

**Codex Session ID**: `019f815d-5648-74b2-999a-9d6d64d4aa2e`

Voxa was built using a highly sophisticated autonomous AI workflow. We utilized **Codex (Master Architect)** alongside an agentic system (GPT-5.6) to design, architect, and implement the codebase.

**How Codex Accelerated Workflow:**
- **Architecture & Planning:** Codex analyzed the initial project brief, reviewed product and design decisions, and produced our core architecture materials including the database design.
- **Refactoring & Optimization:** Codex autonomously refactored the AI pipeline from a slow 7-request waterfall into a single lightning-fast OpenAI Structured Output call, vastly improving response times.
- **UI & Transitions:** Codex engineered the complex UI and Design System, including the sophisticated Framer Motion transitions used in the Premium Report UI and the Growth Loop.
- **Database Design:** Codex designed and implemented the Supabase schema and migrations, including row-level security and seeded scenarios.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Framer Motion
- **AI**: OpenAI `whisper-1` & `gpt-4o-mini` (Structured Outputs)
- **Validation**: Zod
- **Icons**: Lucide React

## 🏃‍♂️ Running Locally

1. Clone the repository.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your `OPENAI_API_KEY`.
4. Run the development server: `npm run dev`
5. Visit `http://localhost:3000` and start a practice session!
