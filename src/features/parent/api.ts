import { mapSessionReportRecordToParentReport } from "./model";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { SessionReportRecord } from "@/lib/supabase/schema";

export async function listParentReports(limit = 10) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("session_reports")
    .select(
      "id,session_id,learner_id,parent_id,learner_name,session_summary,blocked_concepts,confidence_notes,next_recommendations,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return ((data ?? []) as SessionReportRecord[]).map(
    mapSessionReportRecordToParentReport,
  );
}
