# SujiMathAI Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a working Expo + Supabase foundation for Suji and parent roles, with real AI wiring, parent reports, and a local reference-ingest skeleton.

**Architecture:** Create a modular Expo app with typed domain modules, feature folders, Supabase service adapters, OpenAI-backed AI service contracts, and a local Node/Python ingest script boundary for `C:\MathFile`.

**Tech Stack:** Expo, React Native, TypeScript, Expo Router, Supabase, OpenAI API, Zod, Vitest

---

### Task 1: Scaffold The Expo App And Core Tooling

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `tsconfig.json`
- Create: `babel.config.js`
- Create: `app/_layout.tsx`
- Create: `app/index.tsx`
- Create: `src/*`

- [ ] Create the Expo project structure with Router, TypeScript, lint/test scripts, and environment placeholders.
- [ ] Add a minimal home screen that proves the shell renders.
- [ ] Run the first failing and passing integrity checks.
- [ ] Commit the scaffold.

### Task 2: Build Auth And Role Entry

**Files:**
- Create: `src/features/auth/*`
- Create: `app/(auth)/*`
- Create: `src/lib/supabase/*`

- [ ] Implement parent sign-up/sign-in screen shape.
- [ ] Implement learner PIN entry screen shape.
- [ ] Add Supabase client wrapper and typed auth helpers.
- [ ] Add tests for auth role selection state.
- [ ] Commit.

### Task 3: Build Learner Loop And AI Tutor Wiring

**Files:**
- Create: `src/features/tutor/*`
- Create: `src/lib/ai/*`
- Create: `app/(learner)/*`

- [ ] Implement learner dashboard and unit/session start flow.
- [ ] Add tutor message model and OpenAI request contract.
- [ ] Add a real API boundary for tutor responses.
- [ ] Add tests for tutor message normalization and report ordering.
- [ ] Commit.

### Task 4: Build Parent Reports

**Files:**
- Create: `src/features/parent/*`
- Create: `src/features/reports/*`
- Create: `app/(parent)/*`

- [ ] Implement parent report list and latest session summary views.
- [ ] Add report AI summarization contract and schema validation.
- [ ] Persist session summary snapshots through Supabase adapters.
- [ ] Commit.

### Task 5: Add Reference Ingest Skeleton And Expert Report Flow

**Files:**
- Create: `scripts/reference-ingest/*`
- Create: `src/features/expert-reports/*`
- Create: `docs/*`

- [ ] Add local reference scanner config for `C:\MathFile`.
- [ ] Implement placeholder extraction pipeline contracts with reference-only warnings.
- [ ] Build internal report generator helpers that enforce `토론 보고서 -> 작업 -> 할루시네이션 검증 -> 작업보고서`.
- [ ] Commit.

### Task 6: Verify, Package, And Deploy

**Files:**
- Modify: project scripts and docs as needed

- [ ] Run tests, lint, typecheck, and Expo integrity/build commands.
- [ ] Document required environment variables and Supabase setup.
- [ ] Commit final verification updates.
- [ ] Push to GitHub and perform the chosen deploy/publish step.
