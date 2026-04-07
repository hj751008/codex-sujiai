import { describe, expect, it } from "vitest";
import { implementationReportFlow } from "./report-order";

describe("implementationReportFlow", () => {
  it("matches the required discussion-first reporting contract", () => {
    expect(implementationReportFlow).toEqual([
      "토론 보고서",
      "작업",
      "할루시네이션 검증",
      "작업보고서",
    ]);
  });
});
