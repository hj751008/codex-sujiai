import Constants from "expo-constants";

type ExtraConfig = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  openAiModel?: string;
  verifyLearnerPinFunction?: string;
  tutorSessionFunction?: string;
};

export function getPublicEnv() {
  const extra =
    (Constants.expoConfig?.extra as ExtraConfig | undefined) ??
    (Constants.manifest2?.extra?.expoClient?.extra as ExtraConfig | undefined) ??
    {};

  return {
    supabaseUrl: extra.supabaseUrl ?? "",
    supabaseAnonKey: extra.supabaseAnonKey ?? "",
    openAiModel: extra.openAiModel ?? "gpt-5.4",
    verifyLearnerPinFunction:
      extra.verifyLearnerPinFunction ?? "verify-learner-pin",
    tutorSessionFunction: extra.tutorSessionFunction ?? "tutor-session-turn",
  };
}

export function hasPublicSupabaseEnv() {
  const env = getPublicEnv();

  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
