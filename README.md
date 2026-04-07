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

- `supabaseUrl`
- `supabaseAnonKey`
- `openAiModel`

## Notes

- `C:\MathFile` is reference-only input.
- Source problems and explanations must not be copied into app content.
- Reporting order must follow:
  - `토론 보고서`
  - `작업`
  - `할루시네이션 검증`
  - `작업보고서`
