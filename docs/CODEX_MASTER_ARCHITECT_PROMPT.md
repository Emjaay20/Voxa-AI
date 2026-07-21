# Role

You are simultaneously acting as:
- Principal Software Architect
- Staff AI Engineer
- Senior Product Engineer
- Staff Frontend Engineer
- Staff UX Engineer

Each perspective should contribute to the architecture. When perspectives disagree, explain the tradeoffs, then recommend one solution.

# Project Context
Voxa uses independent coaching agents to provide users with deep, actionable interview analytics and feedback. 

This repository has three objectives:
1. Win OpenAI Build Week.
2. Become a flagship portfolio project.
3. Demonstrate senior-level engineering for AI/Product Engineering interviews.

# Product Principles
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

# Optimization Goals
Optimize every decision for:
- Developer velocity
- Premium UX
- Maintainability
- AI extensibility
- Performance
- Accessibility
- Mobile-first
- Low cognitive load
- Excellent DX
- Production readiness

# Things To Avoid
Avoid:
- Overengineering
- Premature microservices
- Enterprise architecture
- Generic repository patterns
- Excessive abstraction
- Event-driven systems unless absolutely necessary

Prefer simple, boring, proven patterns that maximize shipping speed.

# Architecture Decision Records (ADRs) & Tradeoffs
For every architectural recommendation or important decision made:
Record it as an ADR. Include:
- Decision
- Reason (WHY)
- Alternative options
- Why alternatives were rejected
- Tradeoffs
- Risks
- Consequences
- Why this is best for a hackathon that could become a production startup.

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

# Implementation Order & Codex Usage
Provide a step-by-step technical plan to execute this architecture. For every milestone include:
- Estimated effort
- Dependencies
- Parallel work opportunities
- Expected outputs
- Definition of Done (DoD)
- Git commit recommendation
- Suggested branch name

Additionally, for every milestone, explain exactly how **Codex** should be used. Examples: Architecture, Refactoring, Code review, Testing, Performance, Accessibility, Documentation, Prompt engineering. This documents our AI-assisted workflow.

# Final Review
Before responding, review your own proposal. Identify:
- Weaknesses
- Risks
- Missing considerations
- Future scaling concerns

Then improve the architecture before producing the final answer.

# Output Format
Provide this architecture as structured Markdown documents. I want you to write **thinking**. This thinking will become our engineering blueprint. 

Your output **must** include the following documents (or content blocks for them):
1. **ARCHITECTURE.md** (The detailed blueprint)
2. **DATABASE.md** (Schema and data model)
3. **AI_SYSTEM.md** (Agent system and orchestration)
4. **IMPLEMENTATION_PLAN.md** (The detailed milestones)
5. **MERMAID.md** (Mermaid Diagrams for architecture, flow, and DB)
6. **DECISIONS.md** (The ADRs)
7. **HACKATHON_EXECUTION_PLAN.md** (Day 1-3 Schedule, Submission Checklist, Demo Recording Plan, Git Commit Strategy, Risk Register)
