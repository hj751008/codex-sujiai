# codex-sujiai

Canonical React Native repository for the Suji Math AI rebuild.

## Current Foundation

- Expo + Expo Router app shell
- parent and learner role entry screens
- Supabase client boundary
- OpenAI response contracts
- parent report sample model
- expert-report ordering contract
- local `C:\MathFile` reference-ingest config

## Run

```bash
npm install
npm test
npm run typecheck
npx expo export --platform android
```

## Required Public Config

Set these in Expo extra config before live Supabase wiring:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_OPENAI_MODEL`
- `EXPO_PUBLIC_VERIFY_LEARNER_PIN_FUNCTION`
- `EXPO_PUBLIC_TUTOR_SESSION_FUNCTION`

## Supabase Runtime

This repository now includes the runtime shape for live wiring:

- SQL migration: `supabase/migrations/20260408_sujimathai_runtime.sql`
- Edge Function: `supabase/functions/verify-learner-pin`
- Edge Function: `supabase/functions/tutor-session-turn`

Expected rollout order:

1. Apply the SQL migration to the target Supabase project.
2. Set secret env vars in Supabase:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
3. Deploy both Edge Functions.
4. Set the Expo public env vars above.
5. Sign in as parent, create learner, then verify learner PIN on device.

## Notes

- `C:\MathFile` is reference-only input.
- Source problems and explanations must not be copied into app content.
- Reporting order must follow:
  - `토론 보고서`
  - `작업`
  - `할루시네이션 검증`
  - `작업보고서`
