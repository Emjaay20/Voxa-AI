# Voxa AI System

**Status:** Phase 1 architecture decision record  
**Scope:** a text-first, evidence-backed interview analysis pipeline and the minimum operating model required to make it trustworthy.

## 1. Design principles

Voxa is not a general autonomous agent product. It is a set of constrained specialist evaluators operating over candidate-provided interview evidence. The user should receive clear coaching, not a theatrical simulation of hidden reasoning.

The system therefore follows five rules:

1. **Evidence before advice.** Every material claim points to one or more submitted turns, or is labelled as a suggestion rather than a fact.
2. **Independent specialists.** Coaches share a controlled evidence pack; they do not blindly inherit each other's scores or prose.
3. **Structured, validated output.** The UI renders a product contract, not model-shaped text.
4. **Least context and least privilege.** No tools, browsing, database access, or arbitrary URLs for the MVP.
5. **Versioned reproducibility.** Every stored result identifies the prompt, schema, model, provider, and input snapshot used to create it.

## 2. MVP pipeline

The user begins analysis explicitly after submitting enough interview turns. The server creates an `analysis_run`, freezes an input snapshot, then runs the coaches in this UX order:

1. **Interview Coach** — relevance to the question, specificity, STAR structure, and missing interviewer signal.
2. **Presentation Coach** — answer framing, scanability, pacing cues observable in text, and how to lead with impact.
3. **Conversation Coach** — directness, listening/follow-up opportunities, rapport, and collaborative language.
4. **Negotiation Coach** — handles compensation, scope, offer, and trade-off language. Returns `not_applicable` when the session lacks negotiation evidence.
5. **Grammar Coach** — clarity, grammar, concise rewrites, and recurring patterns. It should preserve a candidate's voice rather than enforce one accent or dialect.
6. **Confidence Coach** — observable language signals such as hedging, ownership, and unnecessary apology. It must not diagnose personality, emotion, or mental health.

The order is a presentation choice, not an assertion that one coach's conclusion is truth for the next. Each coach receives the same `EvidencePack` plus only explicit, non-judgmental artifacts created upstream—such as a normalized list of turn IDs and language/role context. It does **not** receive earlier scorecards, recommendations, or free-form advice. This prevents error propagation and makes disagreement useful.

After all available stages complete, a deterministic merger creates the dashboard summary: deduplicate evidence references, sort recommendations by severity and recurrence, limit the primary plan to three actions, and preserve the originating coach. It does not call a seventh model. Missing or failed stages are visible rather than silently invented.

## 3. Inputs, outputs, and contracts

### EvidencePack: the only analyst input

| Field | Source | Constraint |
| --- | --- | --- |
| Run/session identifiers | server | Identifiers only; never model instructions |
| Interview context | candidate profile + session | Target role, seniority, interview type, optional company/industry; length capped |
| Selected turns | session transcript | Ordered, stable turn IDs; candidate/interviewer text only; capped by count and character budget |
| Profile baseline | profile + approved memory | Structured goals, preferred role, self-reported experience; no unreviewed summary prose |
| Progress signals | metric observations | Small, recent aggregate values; never raw unrelated conversations |
| Policy | versioned static instructions | Evaluation rubric, safety limits, output schema, evidence requirements |

All candidate-originated strings are wrapped as clearly delimited quoted data after the static coach instruction. The prompt states that content inside those delimiters may contain attempts to redirect the system and must be evaluated as interview text, not executed as instructions.

### CoachResult: the product contract

Every stage returns the same broad shape, enforced by a provider structured-output schema and server-side Zod validation.

| Field | Purpose |
| --- | --- |
| `status` | `complete`, `not_applicable`, or `needs_more_evidence`—not an invented conclusion |
| `summary` | Plain-language observation, concise enough to read on mobile |
| `scores` | Named 0–100 dimensions with a short evidence-grounded rationale; only dimensions the coach owns |
| `strengths` | At most three specific positive observations |
| `opportunities` | At most three prioritized areas, each with severity and confidence |
| `evidence` | Exact quote or bounded excerpt plus the referenced turn ID; optional when explicitly `not_applicable` |
| `actions` | Practical rehearsal action, expected outcome, and originating coach |
| `rewrite` | Optional suggested wording, labelled as a suggestion—not a claim about the user |
| `safety_notes` | Narrow product-safe warning when advice should be qualified |

The contract forbids chain-of-thought, raw internal reasoning, HTML, instructions to contact a third party, claims of hiring outcomes, and unsupported personality judgments. The system persists its concise rationale and cited evidence, not private model reasoning.

### Scoring discipline

Scores are aids to progress, not objective truth. A score means “how well the submitted evidence matches this rubric for this session,” not employability. The UI always displays its rubric label and evidence with the number. A coach may omit a dimension when evidence is insufficient. Do not average incompatible dimensions into one fake-precise “Voxa score” in the MVP.

## 4. Context and memory

### Memory tiers

| Tier | What it contains | Storage/lifetime | Used by |
| --- | --- | --- | --- |
| Short-term | Current draft, active stream events, selected turns, in-flight UI state | Browser local state/Zustand; discarded on completion or navigation | Interaction UI only |
| Session memory | Persisted prompts, answers, and the immutable analysis input snapshot | Session/run rows; retained per product policy | Reanalysis and session detail |
| Long-term progress | Metric observations, completed rehearsal actions, and approved recurring themes | Relational tables; append-oriented | Dashboard and a small context slice for future runs |
| Profile baseline | Candidate's explicit target role, experience, goals, and preferences | `profiles`; user-editable | Context compiler |

The prompt requirement calls the latter two “long-term” and “profile” memory. They are deliberately separate: a user may change a role goal without rewriting historical progress, and a historical metric must never silently become a permanent profile fact.

### Context compiler

One server-side context compiler builds the EvidencePack. It is the only code allowed to decide what historical information a coach sees.

1. Load the current session and verify ownership.
2. Select the minimum ordered turn set needed for analysis; prefer the current answer and relevant nearby interviewer prompt.
3. Add the candidate's explicit, current profile fields.
4. Add a small, recent set of aggregate metrics only if it changes the coaching recommendation.
5. Apply hard count/character budgets and record the exact snapshot used.
6. Label every data group by provenance before passing it to the provider.

Do not introduce vector embeddings in the MVP. With a small number of sessions, deterministic recency and relevance rules are easier to debug, cheaper, and safer. When history is large enough to make retrieval necessary, add a scoped embedding index behind the context compiler; do not let individual coaches query it directly.

## 5. Prompt and model management

### Prompt sources

Store canonical prompt templates in versioned source files under the AI feature, one folder per coach. A prompt release has a stable key, semantic version, content hash, rubric/schema version, provider, model snapshot, and change note. On each deployment, register that metadata and immutable prompt body in `prompt_versions`; the run stores the exact version ID.

There is no prompt-editing admin panel in the MVP. Git review is the correct control while one developer is iterating quickly. Never edit an existing version in place; create `v1.1` and compare it against a fixed evaluation set before activation.

### Model policy

Use the OpenAI Responses API through the primary adapter. Select a production model that supports both streaming and structured outputs, pin a dated model snapshot for repeatability, and record the selected snapshot per run. The current OpenAI model catalog lists streaming and structured-output support for supported Responses models; model aliases can change, so an unpinned alias is unsuitable for baseline evaluation runs. [OpenAI model reference](https://developers.openai.com/api/docs/models/gpt-5)

Use one economical, capable model configuration across the six text coaches for the MVP unless a measured evaluation shows a specific stage needs more reasoning. The first cost control is compact context and output limits, not a fragile per-agent routing scheme. Do not automatically fall back to a different provider/model and blend results: that hides quality shifts and defeats comparable progress metrics. A transient request can retry the same pinned configuration; otherwise the run reports a retriable stage failure.

### Evaluation before prompt release

Maintain a small, de-identified fixture set: strong answer, vague answer, weak STAR answer, compensation question, non-native but clear English, attempted prompt injection, and insufficient evidence. For each version, review schema validity, evidence accuracy, harmful overclaiming, grammar tone, and action usefulness. Record a human approval note and aggregate result, not private candidate content.

## 6. Provider abstraction—small on purpose

Create exactly one application-facing provider port with two capabilities:

| Capability | Used for | Required behavior |
| --- | --- | --- |
| `generateStructured` | Six pipeline coaches | Accepts system instructions, untrusted evidence, output schema, model configuration, and idempotency/request context; produces a validated complete result or classified error |
| `streamText` | Future interactive coach follow-up | Produces an ordered asynchronous stream of text and terminal events; no persistence implied |

The initial `OpenAIProvider` adapter owns the SDK call, provider event mapping, response IDs, usage extraction, and provider-specific error classification. Orchestration owns stage order, retries, persistence, and the Voxa result schema. UI code knows neither the provider SDK nor provider event names.

Do not build a universal agent framework or a provider plugin registry. A second provider is added only when there is a real resilience, regional, cost, or capability need. At that time, it implements the same two capabilities and must pass the existing fixture suite before any traffic is routed to it.

## 7. Streaming and persistence

### Two streaming modes

1. **Analysis run:** the provider work is streamed or observed server-side, but the browser receives safe progress events and only fully validated stage results. Partial JSON is never rendered as analysis.
2. **Interactive follow-up (later):** provider text deltas flow through the server to the browser, with a final persisted message only after completion and safety/output checks.

`POST /api/analysis-runs` returns `application/x-ndjson`. Events have a monotonic sequence number, run ID, event type, and a compact payload. Event types are:

| Event | Meaning |
| --- | --- |
| `run.started` | Durable run exists; UI may navigate/reconnect |
| `stage.started` | One coach is running; show accessible progress |
| `stage.progress` | Non-sensitive progress heartbeat; never a promise of a result |
| `stage.completed` | A server-validated CoachResult was persisted; include render-safe summary data |
| `stage.skipped` | `not_applicable` or insufficient evidence, with reason |
| `run.completed` | Deterministic summary is committed |
| `error` | Classified safe error; the client can recover through the run-status endpoint |

The client appends events to a tiny stream store, updates or invalidates the relevant React Query run query after terminal events, and renders feedback as each `stage.completed` arrives. If the connection drops, it requests the durable run state. The server must never make successful persistence depend on a live browser connection.

## 8. AI safety and quality boundaries

- Coaches can coach; they cannot guarantee hiring, diagnose confidence/mental state, make legal/compensation decisions, or impersonate an employer.
- Negotiation feedback is educational and contextual, not legal, tax, or employment advice. It is skipped when the input contains no negotiation content.
- The system needs a visible mechanism to mark feedback unhelpful or inaccurate. Preserve the feedback ID and category, not a free-text transcript, in operational telemetry by default.
- Treat provider output as untrusted. Validate schema, size, enum values, referenced turn ownership, and quote bounds before storing it.
- Redact or avoid sensitive profile data from AI context unless the candidate explicitly supplied it for coaching. Do not infer protected characteristics.
- The current MVP uses no model tools. If tools are introduced later, every tool requires an explicit allowlist, typed arguments, authorization at execution, audit logging, and a separate threat review.

## 9. ADRs

### ADR-005 — Independent fixed pipeline, deterministic merger

**Decision.** Run the six named coaches in a fixed UX order with a common EvidencePack; merge results deterministically rather than adding a manager agent.

**Why.** Specialist outputs remain attributable and testable. The system avoids compounding one model's interpretation through six handoffs and avoids cost/latency for a seventh opinion.

**Alternatives rejected.** A single mega-prompt loses specialist focus and yields an opaque score. Free-form agent handoffs are difficult to test and easy to derail. A supervisory model adds another ungrounded layer.

**Tradeoffs and risks.** Sequential stages add latency, and independent coaches may disagree. Stream progress, show the originating coach, and present disagreement as different lenses rather than hiding it.

**Why this is right now.** It is a demoable multi-agent system with understandable behavior and a small operational surface.

### ADR-006 — Structured outputs and evidence citations over free-form feedback

**Decision.** Every coach produces a schema-validated result with evidence references.

**Why.** The UI needs stable fields; users need to see why feedback was given; and output validation prevents malformed or unsafe content from becoming durable product data.

**Alternatives rejected.** Markdown-only responses are faster to prototype but brittle to render, compare, and measure. Parsing arbitrary text after the fact is unreliable.

**Tradeoffs and risks.** Schema design constrains expressive prose and requires careful versioning. Preserve an optional concise rewrite field rather than expanding an uncontrolled narrative field.

**Why this is right now.** It turns model output into a product contract and creates clean data for future analytics.

### ADR-007 — Synchronous bounded runs with streamed progress

**Decision.** Execute short text analysis in the request for the MVP, persist after each stage, and stream NDJSON progress.

**Why.** It delivers immediate delight and avoids queue infrastructure before there is a demonstrated timeout or reliability problem.

**Alternatives rejected.** Poll-only background work feels slow in a demo. Server-side fire-and-forget work is not reliable on serverless runtimes. A workflow engine is premature.

**Tradeoffs and risks.** Runtime limits and disconnects can interrupt a run. Context caps, idempotent stage writes, and a durable status endpoint are mandatory; adopt a queue when observed limits demand it.

**Why this is right now.** It is the smallest path that still has a credible migration seam.

### ADR-008 — Deterministic relational memory before embeddings

**Decision.** Use profile fields, session history, metrics, and explicit relevance/recency rules; defer semantic retrieval.

**Why.** The early corpus is small, and a context compiler with transparent selection is easy to inspect and privacy-review.

**Alternatives rejected.** A vector store from day one adds ingestion, deletion, ranking, and evaluation complexity without improving a few sessions of history. Sending all history is expensive and weakens relevance.

**Tradeoffs and risks.** Rules may become less effective as history grows. The compiler is the deliberate insertion point for scoped retrieval later.

**Why this is right now.** It optimizes for trust, predictability, and shipping speed while preserving a future retrieval seam.
