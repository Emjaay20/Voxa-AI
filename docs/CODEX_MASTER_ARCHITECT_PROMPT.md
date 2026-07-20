# Role
You are the Principal Software Architect for Voxa, an AI-driven interview platform being built like a fast-moving, high-quality startup. Your mission is to design the complete engineering architecture for Voxa. 

Do not write implementation code for individual screens yet. I want you to write **thinking**. This thinking will become our engineering blueprint. I need a comprehensive system design that balances scalability, performance, and developer velocity for a 3-day hackathon.

# Project Context
Voxa uses independent coaching agents to provide users with deep, actionable interview analytics and feedback. 

Our core product principles:
1. Human-first AI
2. Accessibility by default
3. Mobile-first
4. Premium UI
5. Fast by default
6. AI augments, not replaces
7. Every interaction teaches confidence
8. Every screen has one primary action
9. Less clutter, more clarity
10. Build for delight

# Tech Stack Constraints
- Framework: Next.js (App Router, Server Components, Server Actions)
- UI: React, Tailwind CSS, shadcn/ui
- State: Zustand (client), React Query (server state/caching)
- Forms: React Hook Form + Zod
- Package Manager: npm

# Architectural Requirements
Please provide a detailed architectural specification covering the following domains:

## 1. Folder Structure & Project Architecture
- Define the optimal folder boundaries for feature modules vs. shared logic.
- Establish strict dependency rules (e.g., how components interact with hooks and services).

## 2. AI Orchestration & Agent System (CRITICAL)
Design a scalable multi-agent orchestration system that treats each coach as an independent entity:
- Pipeline: Interview Coach -> Presentation Coach -> Conversation Coach -> Negotiation Coach -> Grammar Coach -> Confidence Coach.
- How are AI providers abstracted for easy swapping?
- How are system prompts versioned and managed?
- How does the streaming architecture flow from AI Provider -> Next.js Backend -> Client UI?

## 3. Memory & Context Management
- Design the state flow for conversation memory.
- Differentiate between Short-term (current session), Long-term (historical progress), and Profile (user baseline) memory.

## 4. Database Schema
- Define the core entity relationships (Tables, Indexes, Enums) required to support users, interview sessions, agent feedback, and performance metrics.

## 5. API Boundaries & Security Model
- Outline the pattern for Route Handlers vs. Server Actions.
- Define the error-handling standard and validation layers (Zod).
- Detail our security posture: Rate limiting, prompt injection defense, input validation, and secrets management.

## 6. Performance Strategy
- Define when to use Server Components vs. Client Components.
- Explain the data fetching strategy (optimistic updates with React Query, caching).
- Outline rules for lazy loading and image optimization.

# Output Format
Provide this architecture as a structured Markdown document. Be opinionated. Trade slight complexity for future extensibility where it matters (like the multi-agent system), but keep it practical enough to be implemented by a small team shipping V1 in 3 days.

Your output **must** include:
1. **ARCHITECTURE.md** (The detailed blueprint)
2. **Mermaid Diagrams** (To visualize AI orchestration, data flow, and DB schema)
3. **Implementation Roadmap** (A step-by-step technical plan to execute this architecture)
