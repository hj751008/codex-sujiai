import {
  learnerPinSessionSchema,
  tutorTurnResultSchema,
} from "@/lib/ai/contracts";
import { getPublicEnv } from "@/lib/supabase/env";
import { getSupabaseClient } from "@/lib/supabase/client";
import { buildTutorSessionTurnInput } from "./model";

export async function verifyLearnerPin(learnerId: string, learnerPin: string) {
  const client = getSupabaseClient();
  const env = getPublicEnv();
  const { data, error } = await client.functions.invoke(
    env.verifyLearnerPinFunction,
    {
      body: {
        learnerId,
        learnerPin,
      },
    },
  );

  if (error) {
    throw error;
  }

  return learnerPinSessionSchema.parse(data);
}

export async function runTutorSessionTurn(input: {
  sessionToken: string;
  sessionId?: string;
  unitId: string;
  learnerMessage: string;
}) {
  const client = getSupabaseClient();
  const env = getPublicEnv();
  const payload = buildTutorSessionTurnInput(input);
  const { data, error } = await client.functions.invoke(env.tutorSessionFunction, {
    body: payload,
  });

  if (error) {
    throw error;
  }

  return tutorTurnResultSchema.parse(data);
}
