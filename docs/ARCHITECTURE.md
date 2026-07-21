# Voxa Architecture

**Status:** Phase 1 architecture decision record  
**Audience:** the developer building the MVP and the future maintainers who need to understand its seams  
**Scope:** the first candidate-facing interview-coaching product. This document intentionally does not prescribe an implementation schedule.

## 1. Executive decision

Build Voxa as a **modular Next.js monolith** deployed on Vercel. Use **Supabase** for Auth, PostgreSQL, and private object storage; use the **OpenAI Responses API** through one small provider adapter; and keep all application behavior in this repository. The MVP consists of an authenticated candidate creating a practice session, submitting interview answers, and receiving evidence-backed coaching from a fixed sequence of six specialist coaches.

This is a much better first shape than microservices, a workflow engine, a general agent framework, or a separate backend. It gives one developer a short path from UI to durable data to AI output, while preserving the boundaries that will matter if Voxa earns users: feature modules, a provider seam, immutable analysis snapshots, and a relational data model.

The existing product note names recruiters, HR professionals, and hiring managers as audiences. The coach pipeline and product principles instead describe an individual candidate product. This architecture treats **candidates as the MVP user**; recruiter/team workflows are deliberately deferred because they require organization tenancy, consent, candidate sharing, and a different privacy model.

## 2. Product slice and non-goals

### The three-day MVP must do

1. Authenticate a candidate and collect a minimal interview profile.
2. Create a text-first practice interview session for a role and interview type.
3. Persist interviewer prompts and candidate responses.
4. Run the six defined coaches and show progressive, cited feedback with a single next action.
5. Preserve a simple progress history: scores over time and completed practice sessions.

### Explicit non-goals

- Live video/audio interview analysis, speech prosody scoring, and résumé ingestion.
- Recruiter workspaces, shared candidate records, billing, notifications, and collaboration.
- Fine-tuning, autonomous tools, web search, embeddings, vector databases, and multi-provider failover.
- Background queues or durable workflow orchestration before the synchronous path proves its value.
- A generic repository layer, domain-event bus, or a hand-built design-system abstraction over shadcn/ui.

Text-first is intentional. It removes transcription, media retention, latency, and consent problems from the first product while still demonstrating the core AI experience. Audio can be added later as a separate, consented input pipeline; it should not silently change the meaning of the existing transcript metrics.

## 3. System shape

### Runtime and managed services

| Concern | Decision | Why it fits the MVP | Boundary for later |
| --- | --- | --- | --- |
| Web application | Next.js App Router on Vercel | One TypeScript deployment, excellent Server Component and streaming support | Keep product logic out of route files so it remains portable |
| Identity, database, file storage | Supabase Auth, PostgreSQL, and Storage | Managed, relational, row-level security (RLS), and no separate backend to operate | A standard PostgreSQL schema can move if necessary |
| AI | OpenAI Responses API, accessed only server-side | Structured output and streaming support behind one vendor-supported API | `AIProvider` isolates the provider-specific call shape |
| Rate limiting | Managed, edge-compatible rate-limit store for analysis endpoints | AI requests are the expensive abuse target; this is worth one managed dependency | Apply a shared policy interface, not vendor calls throughout features |
| Error monitoring | Vercel logs plus Sentry (or equivalent) before external launch | Correlates user-facing failures without treating logs as a data store | Scrub transcript content at the logging boundary |

See [MERMAID.md](./MERMAID.md) for the system context and request-flow diagrams.

### Request ownership

The browser never receives a database service key or an AI provider key. It uses the authenticated Supabase session for browser-safe authentication only. The Next.js server verifies identity, validates input, performs privileged database work, and invokes the provider.

`analysis_runs` is the unit of work. At the start of analysis, the server snapshots the allowed session context and the exact prompt/model configuration. The result therefore remains explainable even if the candidate edits their profile or prompts change later.

## 4. Code organization

Use `src/` and organize by product feature, not technical layer. The following is the target structure, not permission to create every directory before it has code.

```text
src/
  app/
    (marketing)/                 # public, mostly static routes
    (app)/                       # authenticated product routes
      dashboard/
      interview/[sessionId]/
      profile/
    api/
      analysis-runs/             # streaming, non-form, or integration endpoints
    layout.tsx
  features/
    auth/
    profile/
    interview/
    analysis/
    progress/
    ai/                          # prompts, orchestration, provider contract
  components/
    ui/                          # shadcn/ui primitives only
    shared/                      # reusable product-agnostic presentation pieces
  lib/
    server/                      # db/auth clients, rate limit, logging; server-only
    validation/                  # boundary schemas shared when safe
    utils/
  providers/                     # query/theme providers and client-only composition
```

### Module responsibilities

| Area | Owns | Must not own |
| --- | --- | --- |
| `app` | Route composition, metadata, server-side access control, loading/error UI, Route Handlers | Business rules, provider calls, ad hoc SQL |
| `features/<name>` | Feature UI, use cases, feature contracts, local validation, feature tests | Imports from another feature's internals |
| `features/ai` | Coach registry, prompt versions, context compiler, orchestration, provider port | UI state or direct HTTP response construction |
| `components/ui` | Upstream shadcn primitives and thin styling variants | Product behavior, data fetching, feature imports |
| `components/shared` | Repeated presentational assemblies with stable, generic props | Database or AI imports |
| `lib/server` | Infrastructure clients and narrowly shared server utilities | Product workflows or a catch-all `services` folder |
| `lib/validation` | Shared Zod schemas and primitives | Authorization decisions |

### Dependency rules

1. Dependencies point inward: `app → features → lib`; shared components may depend only on `lib/utils` and `components/ui`.
2. A feature exposes a small public entry point. Another feature may import that entry point, never files below its private folders.
3. Client Components may call typed client-safe helpers and HTTP/Server Action boundaries; they never import server modules, database clients, provider SDKs, or secrets.
4. Server Components may fetch through feature use cases. They must not hand database records or secrets wholesale to Client Components.
5. Route Handlers authenticate, parse, rate-limit, and delegate. They do not become a second application layer.
6. Zod validates every untrusted boundary: form data, query parameters, JSON bodies, environment configuration, and AI output.

Prefer an ordinary function call over a message bus. Prefer a local feature function over an abstract `Repository<T>`. Extract only after two concrete callers demonstrate the same stable contract.

## 5. Rendering, state, and user experience

### Server Components first

Authenticated dashboard, session detail, history, and initial profile data should render in Server Components. They deliver private initial state without an extra browser round trip and keep the largest data dependencies off the client bundle.

Use Client Components only where the browser adds value: answer drafting, timers, recording controls in a later phase, animated feedback, chart interaction, filters, React Hook Form fields, and the streamed-analysis panel. Keep the client island close to the interaction rather than making an entire route client-rendered.

### State decision

| State kind | Home | Rule |
| --- | --- | --- |
| Persisted server data | Server Component initial data; React Query after client-side mutations | Query keys model a resource, not a screen |
| Form state and validation | React Hook Form + Zod | Do not mirror forms in Zustand |
| Ephemeral UI state | Local React state first | Use for dialogs, selection, and disclosure state |
| Cross-route client preferences / active stream presentation | Zustand | Keep it small, serializable, and non-authoritative |
| Durable truth | PostgreSQL | The server rechecks every write; browser caches are disposable |

Use optimistic updates only when the outcome is local, reversible, and clearly indicated—for example, saving a profile field or marking a feedback item complete. Never optimistically claim that analysis has finished, manufactured a score, or charged quota. Invalidate or update React Query only after the server confirms the canonical write.

### Accessibility and mobile rules

- Every route has one visually obvious primary action. On an interview route it is “Submit answer” or “Start analysis,” never both at once.
- The complete keyboard path must work: start session, focus answer, submit, follow analysis progress, and read feedback.
- Streaming status uses an `aria-live="polite"` region; errors take focus only when they block progress.
- Scores are paired with words and evidence; color is never the only signal.
- On narrow viewports, feedback is a single prioritized column. Dense dashboard comparison belongs behind a deliberate desktop enhancement.
- Respect reduced motion and use native controls where possible. Premium should mean calm and legible, not motion-heavy.

## 6. API and mutation boundaries

### Server Actions

Use Server Actions for authenticated, same-origin, non-streaming mutations triggered by a form: profile updates, session creation, draft persistence, and marking an action complete. Each Action obtains the user from the server session, validates `FormData` with Zod, authorizes ownership, calls one feature use case, and returns a small typed result.

### Route Handlers

Use Route Handlers for work that needs HTTP semantics beyond a form submission:

| Endpoint shape | Purpose |
| --- | --- |
| `POST /api/analysis-runs` | Starts one bounded analysis run and streams progress as NDJSON |
| `GET /api/analysis-runs/:id` | Reads durable status/results to recover after navigation or reconnect |
| `POST /api/coach-chat` (later) | Streams a user-initiated follow-up message, separate from the analysis pipeline |
| Webhooks (later) | Receives signed provider or billing events; never handled by a Server Action |

The initial application does not need REST endpoints for every read. Server Components own page reads; React Query needs a route only where a client island must refetch, poll, or recover independently.

### Error contract

For non-streaming JSON, return one stable envelope:

```text
{ "error": { "code": "SESSION_NOT_FOUND", "message": "…", "requestId": "…", "retryable": false } }
```

For a streaming response, emit an `error` event with the same fields, then close the stream. The UI shows the safe message and a retry action only when `retryable` is true. Internal causes, provider messages, tokens, and stack traces stay in structured server logs keyed by `requestId`.

Use a small error taxonomy: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED`, `RATE_LIMITED`, `CONFLICT`, `PROVIDER_UNAVAILABLE`, and `INTERNAL`. Do not expose a different ad hoc error shape per feature.

## 7. Security and privacy posture

Interview transcripts, company names, compensation discussion, and profile data are sensitive. Treat them as private candidate data, not demo content.

### Required controls from day one

- **Identity and authorization:** require an authenticated user for app routes; enforce ownership in the feature use case and again with PostgreSQL RLS. A guessed session ID must reveal nothing.
- **Input controls:** cap answer length, session title length, number of analysis runs, and attached file types/sizes before storage or provider calls. Normalize whitespace but retain the original submitted text where feedback needs exact quotes.
- **Rate limits:** enforce a per-user and per-IP limit before an analysis invocation, plus a daily analysis quota. Return `429` with a retry time. The application-level limiter complements, rather than replaces, provider limits.
- **Prompt-injection containment:** send user text as delimited, untrusted evidence; instruct coaches that it cannot override policy or request secrets; pass the minimum necessary context; and give the model no tools, browsing, or database access in the MVP. Prompts reduce risk, but lack of privileges is the real control.
- **Output controls:** validate every coach result against its Zod schema, reject malformed output, and render evidence as text rather than HTML. Never persist hidden reasoning or ask the model to reveal it.
- **Secrets:** provider key, Supabase service role key, and rate-limit credentials exist only in server environment variables. `NEXT_PUBLIC_*` contains browser-safe identifiers only. Validate required environment values at startup.
- **Storage:** keep any future uploads in a private bucket, authorize signed URLs server-side, and define a retention/deletion policy before accepting media.
- **Logs and observability:** log IDs, timings, status, model/prompt version, and token/cost metadata; redact prompts, answers, e-mail addresses, compensation figures, and provider payloads by default.

### Retention and deletion

The MVP needs one visible “delete session” path and a “delete account/data” path before public launch. Session deletion must remove dependent feedback, metrics, memories, and private storage objects. Database deletes and storage deletion should be treated as a single user-facing operation, with a recoverable failure state if storage cleanup must retry. Retention duration and legal/privacy copy remain launch decisions, not assumptions embedded in code.

## 8. Performance and reliability

### Performance budget mindset

- Keep marketing pages static and cacheable. Authenticated data is private and dynamic; do not accidentally cache one candidate's feedback for another.
- Send compact analysis input: selected session turns, a small profile summary, and relevant durable metrics. Do not send an entire account history by default.
- Load charts, editors, animation libraries, and future media controls only on the route and interaction that need them. Use `next/image` for app-owned raster imagery and size it explicitly; prefer SVG/Lucide icons for UI icons.
- Paginate session history and feedback evidence. The dashboard's first screen should not fetch every transcript.
- Preserve a reconnect path: the analysis result is committed after each valid coach stage, and `GET /api/analysis-runs/:id` is the source of truth if a browser stream disconnects.

### Synchronous MVP, durable future

One short, text-only analysis run can execute within the request and stream its progress. Cap both context and output. Write state transitions and valid stage output as the pipeline proceeds. This makes the demo immediate and avoids introducing a queue before it is needed.

Move to a durable queue/workflow when any of these becomes true: analysis regularly exceeds the hosting runtime limit, users can close the browser without waiting, retries must survive deployment, media/transcription is introduced, or paid usage requires dependable billing/quota enforcement. The durable boundary is already `analysis_runs`; a worker can claim the same rows without changing product tables or UI contracts.

### Operational basics

- Assign a request ID at the outer boundary and include it in AI-run records and scrubbed logs.
- Record latency, provider request ID, model, prompt version, input/output token counts, outcome, and retry count per coach run.
- Retry only transient provider/network failures with a small bounded backoff. Do not retry validation failures or repeat a completed coach stage.
- Make stage persistence idempotent with a unique `(analysis_run_id, agent_key)` constraint.
- Use migrations in version control. Never apply schema edits manually to production and hope local development catches up.

## 9. ADRs

### ADR-001 — Modular monolith over microservices

**Decision.** Ship one Next.js application with feature modules and managed services.

**Why.** The product has one deployment team, one user-facing workflow, and no independently scaling runtime yet. A monolith gives transactions, shared types, local debugging, and one release path.

**Alternatives rejected.** Microservices add deployment, tracing, auth propagation, and contract-versioning work. A separate API backend duplicates validation and auth context. A generic “clean architecture” layer would add indirection before there are multiple implementations.

**Tradeoffs and risks.** A careless monolith can become tangled. The feature boundaries and dependency rules above are the guardrail. Later extraction is justified only by a concrete independent scaling, ownership, or runtime need.

**Why this is right now.** It maximizes time spent on the candidate experience while retaining an extraction seam around AI orchestration and durable work.

### ADR-002 — Supabase as the managed application backend

**Decision.** Use Supabase Auth, PostgreSQL, RLS, and private Storage for the MVP.

**Why.** Authenticated relational data, ownership policies, and potential private uploads are all needed. One managed platform avoids operating an auth server, database, and object store separately.

**Alternatives rejected.** Firebase optimizes a different data model and makes relational analytics less natural. A custom Auth.js + hosted PostgreSQL stack is viable but has more integration work. An ORM-first design is not necessary for a small, SQL-friendly schema.

**Tradeoffs and risks.** This creates operational dependence on Supabase and requires RLS discipline. Keep application queries standard PostgreSQL, migrations versioned, and service-role usage confined to server infrastructure.

**Why this is right now.** The developer gains secure defaults and a production-capable database without losing the boring portability of Postgres.

### ADR-003 — Server Components for reads; Server Actions and Route Handlers by capability

**Decision.** Render private page reads on the server, use Server Actions for form mutations, and Route Handlers for streaming or integration HTTP.

**Why.** The split follows each mechanism's strength rather than forcing a single transport everywhere.

**Alternatives rejected.** An API route for every operation adds browser round trips and boilerplate. Server Actions for streaming analysis obscure HTTP streaming and recovery semantics. A client-rendered SPA wastes the App Router's server capabilities.

**Tradeoffs and risks.** Three mechanisms require conventions. The boundary table above makes the choice predictable and keeps Actions small.

**Why this is right now.** It is the simplest architecture that supports a polished streamed AI experience without sacrificing SSR and progressive enhancement.

### ADR-004 — React Query for remote cache; Zustand only for small client state

**Decision.** Use React Query as the client cache for server data and Zustand for cross-route, ephemeral UI state.

**Why.** Their responsibilities remain distinct. React Query handles invalidation, retries, and request lifecycles; Zustand avoids prop drilling for the few browser-only interactions that outlive a component.

**Alternatives rejected.** Putting all data in Zustand recreates a fragile server cache. Passing everything through props becomes noisy in streamed flows. Adding Redux is unjustified.

**Tradeoffs and risks.** Two client state tools can be misused. The state table is the ownership test.

**Why this is right now.** Both are already mandated by the stack, and this division prevents a large client-side state architecture from emerging.

## 10. Review: known weaknesses and deliberate follow-ups

- A synchronous six-stage pipeline may hit runtime limits. Its input/output caps, per-stage persistence, and `analysis_runs` seam make the queued-worker migration straightforward, but it is still the first scaling trigger to monitor.
- AI feedback can be persuasive while wrong. Evidence citations, bounded claims, transparent “not applicable” outcomes, and user-visible feedback controls are more important than a higher-looking score.
- The product audience conflict is unresolved. Candidate coaching is the only coherent MVP interpretation; team/recruiter features need their own data-sharing architecture.
- Text-only metrics cannot accurately assess vocal confidence or delivery. The UI must name what it can observe and avoid implying broader psychological or performance certainty.
- RLS must be tested as a security feature, not merely written. Cross-user access tests are required before public use.

The database and agent-specific decisions are intentionally expanded in [DATABASE.md](./DATABASE.md) and [AI_SYSTEM.md](./AI_SYSTEM.md).
