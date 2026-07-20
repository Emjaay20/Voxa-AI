# Voxa Database

**Status:** Phase 1 data architecture decision record  
**Database:** Supabase PostgreSQL  
**Data posture:** private, candidate-owned interview data with RLS as a required enforcement layer.

## 1. Data-model decisions

The model is intentionally relational. Voxa needs ownership checks, ordered transcript turns, immutable analysis snapshots, agent-specific feedback, and time-series progress. Those are natural PostgreSQL relationships—not document blobs with application-enforced joins.

Use `uuid` primary keys, `timestamptz` in UTC, `created_at`, and `updated_at` on mutable user-owned tables. IDs from Supabase `auth.users` are the canonical user IDs. Application tables live in `public`; authentication remains owned by Supabase in `auth`.

Store flexible model-produced detail in `jsonb` only when its shape is versioned and validated at the application boundary. Keep fields used for filtering, ownership, ordering, or dashboards in normal columns. This balance prevents premature table explosion without making product queries opaque.

## 2. Core entities

### `profiles`

One optional baseline per authenticated candidate.

| Column | Type / constraint | Notes |
| --- | --- | --- |
| `id` | `uuid` PK, FK `auth.users(id)` | Same identifier as the authenticated user |
| `display_name` | `text`, nullable | Candidate-controlled |
| `target_role` | `text`, nullable | Included in context only when provided |
| `seniority` | `seniority_level`, nullable | Structured baseline |
| `industry` | `text`, nullable | Optional, not a tenancy field |
| `goals` | `text[]`, non-null default `{}` | Small candidate-authored goal list |
| `preferences` | `jsonb`, non-null default `{}` | Versioned, non-sensitive UI/coaching preferences only |
| `created_at`, `updated_at` | `timestamptz` | Audit timestamps |

### `interview_sessions`

The candidate-owned practice container. A session may have several turns and more than one analysis run, which enables re-analysis after more answers or a prompt version update without overwriting history.

| Column | Type / constraint | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | Session identity |
| `user_id` | `uuid` FK `auth.users(id)`, not null | Ownership/RLS anchor |
| `title` | `text`, not null | Candidate-visible; capped at boundary |
| `target_role` | `text`, nullable | Snapshot of session context, distinct from mutable profile |
| `company_context` | `text`, nullable | Optional and potentially sensitive; never log |
| `interview_type` | `interview_type`, not null | E.g. behavioral or negotiation |
| `status` | `session_status`, not null | Lifecycle, not analysis state |
| `started_at`, `completed_at` | `timestamptz`, nullable | Product timestamps |
| `created_at`, `updated_at` | `timestamptz` | Audit timestamps |

### `session_turns`

An immutable ordered transcript row. One table serves interviewer prompts, candidate answers, and later coach-chat messages without a polymorphic transcript design.

| Column | Type / constraint | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | Referenced by evidence |
| `session_id` | `uuid` FK `interview_sessions(id)`, not null | Parent session |
| `ordinal` | `integer`, not null, `> 0` | Unique per session; establishes canonical order |
| `speaker` | `turn_speaker`, not null | `interviewer`, `candidate`, `coach`, or `system` |
| `content` | `text`, not null | Plain text; no HTML rendering |
| `source` | `turn_source`, not null | User-entered, generated question, or later imported transcript |
| `duration_ms` | `integer`, nullable | Reserved for future media/transcription; absent for text-first MVP |
| `created_at` | `timestamptz` | Immutable creation time |

Constraint: `unique (session_id, ordinal)`. The server assigns ordinals transactionally; clients do not choose them.

### `analysis_runs`

The durable analysis work unit and replay/recovery anchor.

| Column | Type / constraint | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | Stream and status identity |
| `session_id` | `uuid` FK `interview_sessions(id)`, not null | Owning session establishes user access |
| `requested_by_user_id` | `uuid` FK `auth.users(id)`, not null | Audits request ownership |
| `status` | `analysis_status`, not null | Queued/running/terminal lifecycle |
| `input_snapshot` | `jsonb`, not null | Exact validated EvidencePack, schema-versioned and size-capped |
| `input_schema_version` | `text`, not null | Makes old snapshots interpretable |
| `summary` | `jsonb`, nullable | Deterministic merger output after completion |
| `started_at`, `completed_at` | `timestamptz`, nullable | Observability and UX |
| `failure_code` | `analysis_failure_code`, nullable | Safe classified terminal error |
| `request_id` | `uuid`, not null | Log correlation; no transcript in logs |
| `created_at`, `updated_at` | `timestamptz` | Audit timestamps |

An analysis run never updates its `input_snapshot`, prompt references, or completed agent results. A retry creates a new run or resumes only a clearly incomplete stage under the same idempotency rules; it never mixes two input snapshots.

### `agent_feedback`

Exactly one result per active coach stage per analysis run.

| Column | Type / constraint | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | Feedback identity |
| `analysis_run_id` | `uuid` FK `analysis_runs(id)`, not null | Parent work unit |
| `agent_key` | `agent_key`, not null | Fixed named coach enum |
| `status` | `agent_result_status`, not null | Includes `not_applicable` and `needs_more_evidence` |
| `prompt_version_id` | `uuid` FK `prompt_versions(id)`, not null | Exact prompt release |
| `provider` | `text`, not null | E.g. `openai`; operationally useful, not client-controlled |
| `model` | `text`, not null | Pinned snapshot identifier |
| `schema_version` | `text`, not null | Output contract compatibility |
| `result` | `jsonb`, nullable | Validated CoachResult; no private reasoning |
| `input_tokens`, `output_tokens` | `integer`, nullable | Cost/latency observability |
| `provider_request_id` | `text`, nullable | Support correlation; not surfaced to user |
| `started_at`, `completed_at` | `timestamptz`, nullable | Stage timing |
| `failure_code` | `analysis_failure_code`, nullable | Safe classified error |
| `created_at`, `updated_at` | `timestamptz` | Audit timestamps |

Constraint: `unique (analysis_run_id, agent_key)`. This makes stage writes idempotent and prevents duplicate streaming retries from creating two Interview Coach results.

### `feedback_items`

The queryable, candidate-actionable projections of a coach result. `agent_feedback.result` remains the source snapshot; this table is deliberately narrow so dashboard filtering and completion tracking do not parse JSONB for every page.

| Column | Type / constraint | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | Action identity |
| `agent_feedback_id` | `uuid` FK `agent_feedback(id)`, not null | Provenance |
| `kind` | `feedback_item_kind`, not null | `strength`, `opportunity`, or `action` |
| `priority` | `smallint`, nullable, check `1..3` | Applicable to opportunities/actions |
| `title`, `body` | `text`, not null | Render-safe plain text |
| `evidence_turn_id` | `uuid` FK `session_turns(id)`, nullable | Required for factual observation where evidence exists |
| `evidence_quote` | `text`, nullable | Bounded excerpt validated against referenced turn |
| `is_completed` | `boolean`, not null default `false` | Candidate-controlled action state |
| `completed_at` | `timestamptz`, nullable | Null unless completed |
| `created_at`, `updated_at` | `timestamptz` | Audit timestamps |

### `metric_observations`

Append-only measurements used for progress views. A new analysis creates new observations; it does not overwrite a historical score. The UI can show a trend only after it has comparable data points.

| Column | Type / constraint | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | Observation identity |
| `user_id` | `uuid` FK `auth.users(id)`, not null | Direct dashboard ownership |
| `session_id` | `uuid` FK `interview_sessions(id)`, not null | Provenance |
| `analysis_run_id` | `uuid` FK `analysis_runs(id)`, not null | Exact run provenance |
| `agent_key` | `agent_key`, nullable | Null only for a future deterministic cross-agent metric |
| `metric_key` | `text`, not null | Stable names such as `star_structure` |
| `value` | `numeric(5,2)`, not null, check `0..100` | Score, not a percent of employability |
| `scale_version` | `text`, not null | Required to prevent invalid trend comparisons |
| `observed_at` | `timestamptz`, not null | Usually run completion time |
| `created_at` | `timestamptz` | Audit timestamp |

### `memory_items`

Long-term, approved coaching facts only—not a shadow transcript store.

| Column | Type / constraint | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | Memory identity |
| `user_id` | `uuid` FK `auth.users(id)`, not null | Owner |
| `kind` | `memory_kind`, not null | `recurring_theme` or `completed_action` in MVP |
| `content` | `text`, not null | Concise, candidate-visible fact or summary |
| `source_analysis_run_id` | `uuid` FK `analysis_runs(id)`, nullable | Provenance if generated from coaching |
| `confidence` | `numeric(3,2)`, nullable, check `0..1` | Model confidence is advisory, never ownership authority |
| `expires_at` | `timestamptz`, nullable | Optional freshness control |
| `created_at`, `updated_at` | `timestamptz` | Audit timestamps |

Do not auto-promote arbitrary model prose into memory. In the MVP, create recurring themes only through deterministic recurrence rules or an explicit candidate confirmation.

### `prompt_versions`

Immutable audit trail for AI behavior.

| Column | Type / constraint | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | Version identity |
| `agent_key` | `agent_key`, not null | Coach owner |
| `version` | `text`, not null | Semantic release label |
| `content_hash` | `text`, not null | Detects accidental edits |
| `prompt_body` | `text`, not null | Immutable deployed snapshot; contains no user data |
| `schema_version` | `text`, not null | Expected CoachResult shape |
| `provider`, `model` | `text`, not null | Default compatible config |
| `change_note` | `text`, not null | Human-reviewable reason |
| `is_active` | `boolean`, not null default `false` | At most one active version per coach |
| `created_at` | `timestamptz` | Release timestamp |

Constraints: `unique (agent_key, version)` and a partial unique index enforcing one active version for each `agent_key`.

## 3. Enums

| Enum | Values |
| --- | --- |
| `seniority_level` | `intern`, `junior`, `mid`, `senior`, `staff_plus`, `executive`, `unspecified` |
| `interview_type` | `behavioral`, `technical`, `case_study`, `leadership`, `negotiation`, `general` |
| `session_status` | `draft`, `in_progress`, `ready_for_analysis`, `completed`, `archived` |
| `turn_speaker` | `interviewer`, `candidate`, `coach`, `system` |
| `turn_source` | `user_entered`, `generated_prompt`, `imported_transcript` |
| `analysis_status` | `queued`, `running`, `completed`, `failed`, `cancelled` |
| `analysis_failure_code` | `provider_unavailable`, `provider_invalid_output`, `rate_limited`, `timeout`, `cancelled`, `internal` |
| `agent_key` | `interview`, `presentation`, `conversation`, `negotiation`, `grammar`, `confidence` |
| `agent_result_status` | `pending`, `running`, `complete`, `not_applicable`, `needs_more_evidence`, `failed`, `skipped` |
| `feedback_item_kind` | `strength`, `opportunity`, `action` |
| `memory_kind` | `recurring_theme`, `completed_action` |

Enums are appropriate here because the pipeline's agent keys and lifecycle states are controlled code contracts. Metric keys remain strings because their rubric will evolve more often; `scale_version` keeps that evolution honest.

## 4. Relationships and deletion policy

```text
auth.users 1 ── 1 profiles
auth.users 1 ── * interview_sessions 1 ── * session_turns
interview_sessions 1 ── * analysis_runs 1 ── * agent_feedback 1 ── * feedback_items
analysis_runs 1 ── * metric_observations
auth.users 1 ── * metric_observations
auth.users 1 ── * memory_items
prompt_versions 1 ── * agent_feedback
```

For user-created content, delete session children when a session is deleted: turns, runs, feedback, items, and run-derived metrics/memory. Keep no orphaned analysis artifacts. A future billing/audit requirement may need a separate, privacy-reviewed aggregate ledger; do not retain candidate content “just in case.”

`prompt_versions` must be retained while referenced by any `agent_feedback`; deactivate rather than delete. A user deletion does not remove prompt templates because they are not user data.

## 5. Indexes and query patterns

Create indexes to support an observed query, not every foreign key by reflex. The initial set is:

| Table | Index | Supports |
| --- | --- | --- |
| `interview_sessions` | `(user_id, updated_at desc)` | Dashboard/history list |
| `session_turns` | `(session_id, ordinal)` unique | Ordered session loading and evidence lookup |
| `analysis_runs` | `(session_id, created_at desc)` | Session result history and recovery |
| `analysis_runs` | `(requested_by_user_id, created_at desc)` | Candidate quota/history lookup |
| `agent_feedback` | `(analysis_run_id, agent_key)` unique | Idempotent stage persistence |
| `feedback_items` | `(agent_feedback_id, priority)` | Result detail and action ordering |
| `metric_observations` | `(user_id, metric_key, observed_at desc)` | Dashboard trends |
| `memory_items` | `(user_id, kind, created_at desc)` | Context compiler recency selection |
| `prompt_versions` | partial unique `(agent_key) where is_active` | Active prompt lookup |

Avoid a JSONB GIN index initially. It is tempting but unnecessary while all user-facing filters are modeled as columns. Add one only after a measured query needs a specific JSON path.

## 6. RLS and authorization

Enable RLS on every application table. The candidate can select, insert, update, and delete only rows they own or rows whose parent session/run belongs to them. Child policies should use ownership anchored at `interview_sessions.user_id` or an intentional `user_id` column; never trust a user ID supplied by the browser.

| Table | Candidate access | Server/service access |
| --- | --- | --- |
| `profiles` | Own row only | Create/update during auth or trusted use case |
| `interview_sessions`, `session_turns` | Own sessions and descendants only | Trusted server use case; ordinal assignment |
| `analysis_runs`, `agent_feedback`, `metric_observations`, `memory_items` | Read own derived data; candidate cannot write AI results directly | Orchestrator writes with service role after verified ownership |
| `feedback_items` | Read own items; may update only `is_completed`/`completed_at` through a constrained server mutation | Orchestrator creates; server enforces editable fields |
| `prompt_versions` | No direct access | Deploy/admin server only |

RLS is defense in depth, not a substitute for server-side authorization. The server still verifies that the authenticated user owns a session before starting a run. Test one cross-user read and one cross-user write attempt per table class before launch.

## 7. Migration and data-quality rules

- Use version-controlled SQL migrations through the Supabase CLI. Develop against a local or isolated project database; apply the same migration to preview before production.
- Put `updated_at` maintenance in a database trigger or a single, consistently applied database mechanism—not scattered application code.
- Add foreign keys and check constraints before application code relies on them. Database constraints are the final data-integrity boundary.
- Validate model output before inserting `agent_feedback`, then create its `feedback_items` and `metric_observations` in one transaction.
- Use database transactions when starting a run (run + input snapshot) and when completing a stage (feedback + projections + metrics). Never leave a visible completed stage without its actions/metrics.
- Run a schema dump/diff check in CI once migrations exist. Back up production before destructive migrations; favor additive and backfill migrations.

## 8. ADRs

### ADR-009 — Postgres with normalized core entities and versioned JSONB payloads

**Decision.** Use Supabase PostgreSQL with relational tables for ownership, ordering, analysis lifecycle, feedback projections, and metrics; retain validated raw input/output snapshots as JSONB.

**Why.** It supports secure joins and dashboard queries while preserving the exact AI artifact needed for audit and prompt iteration.

**Alternatives rejected.** A document database makes transcript/feedback provenance and trend queries harder. Fully normalizing every model-output leaf would freeze an evolving rubric and slow delivery. Storing everything as JSONB makes RLS-safe queries and progress features brittle.

**Tradeoffs and risks.** There is intentional duplication between `agent_feedback.result` and `feedback_items`/metrics. The transaction rule and source-of-truth declaration make it controlled, useful denormalization.

**Why this is right now.** It is simple enough for one developer, queryable for the product, and auditable for an AI portfolio project.

### ADR-010 — Immutable analysis runs and append-only observations

**Decision.** Freeze an input snapshot for every run, create one feedback result per coach/run, and append metric observations rather than mutating historical scores.

**Why.** A candidate can understand what produced a result, engineers can reproduce regressions, and trend charts do not rewrite history when prompts change.

**Alternatives rejected.** Updating a single “latest feedback” row loses prompt/model provenance. Recomputing historical scores silently after a prompt edit makes progress meaningless.

**Tradeoffs and risks.** Storage grows over time. The MVP corpus is small, and retention/deletion policy addresses the actual cost/privacy risk better than discarding explainability.

**Why this is right now.** It gives the MVP production-grade traceability without a separate event store.

### ADR-011 — RLS as a mandatory ownership backstop

**Decision.** Enforce candidate ownership with PostgreSQL RLS in addition to server-side checks.

**Why.** Interview transcripts are private. A route authorization bug must not automatically become a cross-user data leak.

**Alternatives rejected.** Application-only authorization relies on every future query being perfect. Per-user databases are operationally excessive. Security by unguessable UUID is not authorization.

**Tradeoffs and risks.** Policies add test and query complexity, especially through child tables. Centralize the ownership pattern and test it.

**Why this is right now.** The setup cost is small compared with the privacy consequence of getting this wrong.
