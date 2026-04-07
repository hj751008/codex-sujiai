import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "SujiMathAI",
  slug: "codex-sujiai",
  scheme: "sujimathai",
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  android: {
    package: "com.hj751008.sujimathai",
  },
  experiments: {
    typedRoutes: true,
  },
  plugins: ["expo-router"],
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
    openAiModel: process.env.EXPO_PUBLIC_OPENAI_MODEL ?? "gpt-5.4",
    verifyLearnerPinFunction:
      process.env.EXPO_PUBLIC_VERIFY_LEARNER_PIN_FUNCTION ??
      "verify-learner-pin",
    tutorSessionFunction:
      process.env.EXPO_PUBLIC_TUTOR_SESSION_FUNCTION ?? "tutor-session-turn",
  },
};

export default config;
