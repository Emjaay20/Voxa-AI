# Voxa Mermaid Diagrams

These diagrams are part of the architecture, not decoration. They show the boundaries that keep the MVP simple now and make its future evolution legible.

## 1. System context and trust boundaries

```mermaid
flowchart LR
    candidate["Candidate\nMobile or desktop browser"]
    app["Voxa Next.js application\nVercel"]
    rsc["Server Components +\nServer Actions"]
    api["Route Handlers\nStreaming analysis API"]
    ai["AI orchestration\nContext compiler + coach pipeline"]
    supa["Supabase\nAuth + Postgres + private Storage"]
    limiter["Managed rate-limit store"]
    openai["OpenAI Responses API"]
    monitor["Scrubbed logs + error monitoring"]

    candidate -->|"Authenticated HTTPS"| app
    app --> rsc
    app --> api
    rsc -->|"Verified user-scoped reads/writes"| supa
    api -->|"Authenticate, validate, authorize"| ai
    api -->|"Enforce quota"| limiter
    ai -->|"Read/write durable run state"| supa
    ai -->|"Server-side provider request"| openai
    app -->|"IDs, status, latency only"| monitor
    ai -->|"No transcript payloads"| monitor

    classDef trust fill:#143a52,stroke:#77b6d6,color:#ffffff
    classDef managed fill:#283848,stroke:#a8c4d6,color:#ffffff
    classDef external fill:#4c3756,stroke:#d7a7e8,color:#ffffff
    class candidate,app,rsc,api,ai trust
    class supa,limiter,monitor managed
    class openai external
```

**Boundary rule:** The browser has a user session but never a service-role or AI-provider secret. The only outbound AI call originates from the server after identity, ownership, size, and rate-limit checks.

## 2. Modular monolith dependency direction

```mermaid
flowchart TD
    app["app routes\nComposition, routing, metadata"]
    features["features\nProfile · Interview · Analysis · Progress · AI"]
    publicApi["Feature public APIs\nSmall explicit contracts"]
    shared["components/shared\nPresentational assemblies"]
    ui["components/ui\nshadcn primitives"]
    lib["lib/server + lib/validation + lib/utils\nInfrastructure and shared primitives"]
    providers["providers\nReact Query / theme composition"]
    ext["Supabase / OpenAI / rate limit\nAccessed only through server infrastructure"]

    app --> features
    app --> shared
    app --> providers
    features --> publicApi
    features --> ui
    features --> shared
    features --> lib
    shared --> ui
    shared --> lib
    providers --> ui
    lib --> ext

    noClient["Client Components must not import\nlib/server or provider SDKs"]
    noCross["Features may not import\nother feature internals"]
    noClient -. "enforced by module boundaries" .-> lib
    noCross -. "use public APIs" .-> publicApi

    classDef top fill:#143a52,stroke:#77b6d6,color:#ffffff
    classDef middle fill:#2c5364,stroke:#9ecae1,color:#ffffff
    classDef base fill:#38434f,stroke:#bccad3,color:#ffffff
    classDef note fill:#fff4cc,stroke:#c99f00,color:#3f3300
    class app top
    class features,publicApi,shared,providers middle
    class ui,lib,ext base
    class noClient,noCross note
```

## 3. Analysis request, streaming, and recovery

```mermaid
sequenceDiagram
    autonumber
    participant C as Candidate UI
    participant R as Next.js Route Handler
    participant L as Rate limiter
    participant D as Postgres
    participant O as Orchestrator
    participant P as OpenAI provider

    C->>R: POST analysis run (session ID)
    R->>R: Authenticate, Zod validate, authorize session
    R->>L: Check user/IP quota
    L-->>R: Allowed
    R->>D: Create analysis_run + immutable EvidencePack
    D-->>R: run ID
    R-->>C: NDJSON run.started
    R->>O: Start bounded pipeline

    loop Each named coach
        O->>D: Mark stage running
        O-->>C: NDJSON stage.started
        O->>P: Structured analysis with untrusted evidence
        P-->>O: Provider events / final structured result
        O->>O: Validate schema, evidence ownership, quote bounds
        O->>D: Transaction: feedback + items + metrics
        O-->>C: NDJSON stage.completed
    end

    O->>D: Commit deterministic run summary
    O-->>C: NDJSON run.completed

    Note over C,D: If the stream disconnects, the UI requests GET analysis-runs/:id.<br/>Durable run state—not stream state—is authoritative.
```

## 4. Coach independence and context assembly

```mermaid
flowchart LR
    profile["Current profile baseline"]
    turns["Selected ordered session turns"]
    history["Small recent metric slice"]
    policy["Versioned coach rubric\nand output schema"]
    compiler["Server-side context compiler\nBudgets + provenance labels"]
    pack["Immutable EvidencePack\nstored on analysis_run"]

    profile --> compiler
    turns --> compiler
    history --> compiler
    policy --> compiler
    compiler --> pack

    pack --> interview["Interview Coach"]
    pack --> presentation["Presentation Coach"]
    pack --> conversation["Conversation Coach"]
    pack --> negotiation["Negotiation Coach"]
    pack --> grammar["Grammar Coach"]
    pack --> confidence["Confidence Coach"]

    interview --> results["Validated, attributed\nCoachResults"]
    presentation --> results
    conversation --> results
    negotiation --> results
    grammar --> results
    confidence --> results
    results --> merge["Deterministic merger\nNo seventh model"]
    merge --> plan["Three prioritized actions\nwith evidence and source coach"]

    classDef input fill:#38434f,stroke:#bccad3,color:#ffffff
    classDef control fill:#4c3756,stroke:#d7a7e8,color:#ffffff
    classDef agent fill:#143a52,stroke:#77b6d6,color:#ffffff
    classDef output fill:#1e5d4f,stroke:#9bd2b1,color:#ffffff
    class profile,turns,history input
    class policy,compiler,pack control
    class interview,presentation,conversation,negotiation,grammar,confidence agent
    class results,merge,plan output
```

**Important:** The arrows fan out from a common EvidencePack. The listed coach order controls progress presentation, but no coach's scorecard is silently supplied to another coach.

## 5. Memory lifecycle

```mermaid
flowchart TD
    draft["Short-term browser state\nDraft answer + stream UI"]
    submit["Candidate submits answer"]
    session["Session memory\nOrdered persisted turns"]
    snapshot["Immutable analysis snapshot"]
    feedback["Validated feedback + metrics"]
    profile["Profile baseline\nUser-editable goals and role"]
    longterm["Long-term progress\nMetrics + approved recurring themes"]
    nextRun["Next context compiler"]

    draft --> submit --> session --> snapshot --> feedback
    feedback --> longterm
    profile --> nextRun
    session --> nextRun
    longterm --> nextRun
    nextRun --> snapshot

    erase["Delete session/account\nCascades through derived data"]
    session -. "privacy deletion" .-> erase
    feedback -. "privacy deletion" .-> erase
    longterm -. "privacy deletion" .-> erase

    classDef transient fill:#fff4cc,stroke:#c99f00,color:#3f3300
    classDef durable fill:#143a52,stroke:#77b6d6,color:#ffffff
    classDef derived fill:#1e5d4f,stroke:#9bd2b1,color:#ffffff
    classDef privacy fill:#6a2e2e,stroke:#e7a5a5,color:#ffffff
    class draft transient
    class session,snapshot,profile durable
    class feedback,longterm,nextRun derived
    class erase privacy
```

## 6. Entity relationship diagram

```mermaid
erDiagram
    AUTH_USERS ||--|| PROFILES : has
    AUTH_USERS ||--o{ INTERVIEW_SESSIONS : owns
    INTERVIEW_SESSIONS ||--o{ SESSION_TURNS : contains
    INTERVIEW_SESSIONS ||--o{ ANALYSIS_RUNS : analyzed_by
    ANALYSIS_RUNS ||--o{ AGENT_FEEDBACK : produces
    PROMPT_VERSIONS ||--o{ AGENT_FEEDBACK : defines
    AGENT_FEEDBACK ||--o{ FEEDBACK_ITEMS : projects
    SESSION_TURNS ||--o{ FEEDBACK_ITEMS : cited_by
    AUTH_USERS ||--o{ METRIC_OBSERVATIONS : owns
    ANALYSIS_RUNS ||--o{ METRIC_OBSERVATIONS : measures
    INTERVIEW_SESSIONS ||--o{ METRIC_OBSERVATIONS : sourced_from
    AUTH_USERS ||--o{ MEMORY_ITEMS : owns
    ANALYSIS_RUNS ||--o{ MEMORY_ITEMS : may_source

    PROFILES {
        uuid id PK
        text target_role
        seniority_level seniority
        jsonb preferences
    }
    INTERVIEW_SESSIONS {
        uuid id PK
        uuid user_id FK
        interview_type interview_type
        session_status status
        timestamptz updated_at
    }
    SESSION_TURNS {
        uuid id PK
        uuid session_id FK
        int ordinal
        turn_speaker speaker
        text content
    }
    ANALYSIS_RUNS {
        uuid id PK
        uuid session_id FK
        analysis_status status
        jsonb input_snapshot
        timestamptz created_at
    }
    AGENT_FEEDBACK {
        uuid id PK
        uuid analysis_run_id FK
        agent_key agent_key
        uuid prompt_version_id FK
        agent_result_status status
        jsonb result
    }
    FEEDBACK_ITEMS {
        uuid id PK
        uuid agent_feedback_id FK
        uuid evidence_turn_id FK
        feedback_item_kind kind
        boolean is_completed
    }
    METRIC_OBSERVATIONS {
        uuid id PK
        uuid user_id FK
        uuid analysis_run_id FK
        text metric_key
        numeric value
        text scale_version
    }
    MEMORY_ITEMS {
        uuid id PK
        uuid user_id FK
        uuid source_analysis_run_id FK
        memory_kind kind
        text content
    }
    PROMPT_VERSIONS {
        uuid id PK
        agent_key agent_key
        text version
        text model
        boolean is_active
    }
```

The `agent_feedback.result` JSONB field preserves the complete validated model artifact; `feedback_items` and `metric_observations` are intentional query projections for the product UI.
