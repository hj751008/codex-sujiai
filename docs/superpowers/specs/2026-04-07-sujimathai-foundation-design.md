# SujiMathAI Foundation Design

## Goal

Build the first canonical version of Suji Math AI as an Android-first React Native app using Expo and Supabase.

The app serves two roles:

- Suji, the learner
- Parent, the report viewer

The first release must include:

- simple parent account creation and learner PIN entry
- a real AI tutoring flow
- cloud-stored study sessions
- parent-facing learning reports
- a local reference-ingest pipeline that reads `C:\MathFile` as reference-only input
- an internal expert-report structure that follows the required reporting order

## Product Principles

- The app exists to help Suji recover the "first step" in math, not just produce answers.
- The learner experience may look like a free-form tutor, but the internal system must still bias toward concept connection and recovery.
- Source PDFs are reference material only. No textbook wording or problems may be reused directly.
- Parent UX is report-first, not intervention-first.
- Structure must stay modular from day one so the app does not collapse into one giant chat screen and one giant backend file.

## Chosen Product Shape

### User Roles

- Parent
  - creates account
  - creates learner profile
  - views summaries, blocked concepts, AI session digest, recommended next steps
- Suji
  - enters via parent-linked PIN
  - chooses a grade and unit
  - learns through AI chat, guided cards, and short reflections

### Learning Loop

1. Parent creates learner profile
2. Suji signs in with learner PIN
3. Suji chooses unit and starts a study session
4. Tutor AI responds in-context
5. Session data is persisted to Supabase
6. Report AI summarizes the session for the parent
7. Parent sees updated learning report

### Reference Pipeline

- `C:\MathFile\중1`, `중2`, `중3` are scanned locally
- PDFs are analyzed for:
  - concept coverage
  - misconception patterns
  - likely difficulty spread
- The output is internal metadata only
- The app only consumes rewritten, original guidance derived from that metadata

## Architecture

### Client

- Expo app
- Expo Router for navigation
- feature areas:
  - onboarding
  - auth
  - learner dashboard
  - tutoring
  - parent report
  - expert report log

### Backend

- Supabase Auth
- Supabase Postgres
- Row-level security from the start
- Tables for:
  - parent profiles
  - learner profiles
  - study sessions
  - tutor messages
  - session reports
  - concept observations

### AI Layer

- tutor agent
  - learner-facing responses
- report agent
  - parent-facing summary generation
- curriculum analyzer
  - local reference extraction and normalization

Each AI role has a distinct prompt contract and structured output.

## Technical Boundaries

- Do not build a full admin console in this phase
- Do not expose source PDFs in the app
- Do not overbuild multi-tenant organization logic
- Do not attempt full curriculum generation before the core learner-report loop works

## File / Module Strategy

- `src/features/auth/*`
- `src/features/learner/*`
- `src/features/parent/*`
- `src/features/tutor/*`
- `src/features/reports/*`
- `src/features/expert-reports/*`
- `src/lib/supabase/*`
- `src/lib/ai/*`
- `src/lib/domain/*`
- `scripts/reference-ingest/*`

## Validation Strategy

- unit tests for core domain shaping and report ordering
- schema validation for AI outputs
- smoke checks for local reference ingest
- TypeScript compile
- Expo export or web build check for basic integrity

## Reporting Contract

All progress reporting during implementation must follow this order:

1. `토론 보고서`
2. `작업`
3. `할루시네이션 검증`
4. rework if needed
5. `작업보고서`

The expert-discussion content should not be omitted. Each phase must include role-based perspectives and a synthesis.
