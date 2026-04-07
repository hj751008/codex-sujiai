import { buildCreateLearnerProfileInput, buildParentAccountInput } from "./model";
import {
  getSupabaseClient,
} from "@/lib/supabase/client";
import type {
  CreateLearnerProfileRpcInput,
  LearnerProfileRecord,
} from "@/lib/supabase/schema";

export async function signUpParentAccount(
  email: string,
  familyName: string,
  password: string,
) {
  const client = getSupabaseClient();
  const payload = buildParentAccountInput({ email, familyName }, password);
  const { data, error } = await client.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        family_name: payload.familyName,
      },
    },
  });

  if (error) {
    throw error;
  }

  if (data.user) {
    const { error: upsertError } = await (client.from("parent_profiles") as any)
      .upsert(
        {
          id: data.user.id,
          family_name: payload.familyName,
        },
        { onConflict: "id" },
      );

    if (upsertError) {
      throw upsertError;
    }
  }

  return data;
}

export async function signInParentAccount(email: string, password: string) {
  const client = getSupabaseClient();
  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await client.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOutParentAccount() {
  const client = getSupabaseClient();
  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getCurrentParentUser() {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

export async function createLearnerProfile(
  learnerName: string,
  learnerPin: string,
  grade: CreateLearnerProfileRpcInput["p_grade"],
) {
  const client = getSupabaseClient();
  const payload = buildCreateLearnerProfileInput({
    learnerName,
    learnerPin,
    grade,
  });
  const { data, error } = await (client.rpc as any)("create_learner_profile", {
    p_learner_name: payload.learnerName,
    p_grade: payload.grade,
    p_pin: payload.learnerPin,
  });

  if (error) {
    throw error;
  }

  return data as unknown as LearnerProfileRecord;
}

export async function listParentLearners() {
  const client = getSupabaseClient();
  const { data, error } = await (client
    .from("learner_profiles")
    .select("id,parent_id,learner_name,grade,pin_hint,created_at")
    .order("created_at", { ascending: true }) as any);

  if (error) {
    throw error;
  }

  return (data ?? []) as LearnerProfileRecord[];
}
