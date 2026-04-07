import type { ParentReport } from "@/lib/ai/contracts";
import type { SessionReportRecord } from "@/lib/supabase/schema";

export const sampleParentReport: ParentReport = {
  learnerName: "수지",
  sessionSummary:
    "문자와 식 단원에서 문제의 시작점을 잡는 데 시간이 걸렸지만, 문자 하나가 무엇을 대신하는지 말로 풀어내며 회복했다.",
  blockedConcepts: ["문제에서 식으로 옮기는 시작점", "두 개념이 섞인 문장 해석"],
  confidenceNotes: ["중간부터는 스스로 식의 의미를 설명하려는 시도가 늘었다."],
  nextRecommendations: [
    "짧은 문장형 문제를 식으로 바꾸는 연습 3문제",
    "문자 하나를 말로 설명하는 복기 질문",
  ],
};

export function mapSessionReportRecordToParentReport(
  record: SessionReportRecord,
): ParentReport {
  return {
    learnerName: record.learner_name,
    sessionSummary: record.session_summary,
    blockedConcepts: record.blocked_concepts ?? [],
    confidenceNotes: record.confidence_notes ?? [],
    nextRecommendations: record.next_recommendations ?? [],
  };
}
