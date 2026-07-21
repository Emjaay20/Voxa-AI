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

Voxa is built on a feature-first Next.js (App Router) architecture, utilizing a cutting-edge AI pipeline:

1. **Audio Capture**: Real-time microphone recording in the browser.
2. **Transcription**: OpenAI's Whisper model (`whisper-1`) transcribes the audio with high fidelity.
3. **Structured Multi-Agent Coaching**: The transcript is passed to `gpt-4o-mini`, which acts as a committee of 6 distinct coaches (Clarity, Delivery, Confidence, Storytelling, Engagement, Expert). We use OpenAI's Structured Outputs (Zod) to guarantee a perfectly typed schema in a single lightning-fast API call.
4. **Graceful Degradation**: The backend includes a self-healing fallback mechanism that seamlessly intercepts `429` (Quota) or `401` errors and returns realistic development mock data, ensuring the UI flow never breaks during a live demo.

## 🤖 Built with Codex & GPT-5.6

Voxa was built using a highly sophisticated autonomous AI workflow. We utilized **Codex (Master Architect)** alongside an agentic system (GPT-5.6) to design, architect, and implement the codebase.

The agents were responsible for:
- Implementing the Feature-First Architecture.
- Engineering the UI and Design System (Vanilla CSS & Tailwind).
- Refactoring the AI pipeline from a 7-request waterfall into a single Structured Output call.
- Designing the magic Framer Motion transitions and the Premium Report UI.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
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
