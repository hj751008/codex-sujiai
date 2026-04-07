import { createClient } from "@supabase/supabase-js";
import { getPublicEnv } from "./env";

let cachedClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const env = getPublicEnv();

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      "Supabase public env is missing. Set supabaseUrl and supabaseAnonKey in Expo extra config.",
    );
  }

  cachedClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  return cachedClient;
}
