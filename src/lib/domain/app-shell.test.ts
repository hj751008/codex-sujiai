import { describe, expect, it } from "vitest";
import { createInitialAppShellState } from "./app-shell";

describe("createInitialAppShellState", () => {
  it("defaults to parent-first onboarding and android-first scope", () => {
    const state = createInitialAppShellState();

    expect(state.roles).toEqual(["parent", "learner"]);
    expect(state.platformPriority).toBe("android-first");
    expect(state.reportMode).toBe("parent-report-first");
  });
});
