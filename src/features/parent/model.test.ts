import { describe, expect, it } from "vitest";
import { mapSessionReportRecordToParentReport } from "./model";

describe("parent report model", () => {
  it("maps a Supabase row into the parent report contract", () => {
    const report = mapSessionReportRecordToParentReport({
      learner_name: "수지",
      session_summary: "시작점을 다시 잡아냈다.",
      blocked_concepts: ["문장을 식으로 옮기기"],
      confidence_notes: null,
      next_recommendations: ["문장형 문제 3개 복기"],
      created_at: "2026-04-08T12:00:00.000Z",
      session_id: "session-1",
      learner_id: "learner-1",
      parent_id: "parent-1",
      id: "report-1",
    });

    expect(report.learnerName).toBe("수지");
    expect(report.blockedConcepts).toEqual(["문장을 식으로 옮기기"]);
    expect(report.confidenceNotes).toEqual([]);
    expect(report.nextRecommendations).toEqual(["문장형 문제 3개 복기"]);
  });
});
