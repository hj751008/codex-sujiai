import { describe, expect, it } from "vitest";
import {
  buildCreateLearnerProfileInput,
  buildParentAccountInput,
  normalizeLearnerPin,
} from "./model";

describe("auth model", () => {
  it("normalizes learner pin to four digits", () => {
    expect(normalizeLearnerPin(" 12a3-45 ")).toBe("1234");
  });

  it("builds a trimmed parent account payload", () => {
    expect(
      buildParentAccountInput(
        {
          email: "  suji@example.com ",
          familyName: "  수지가족 ",
        },
        "password-1234",
      ),
    ).toEqual({
      email: "suji@example.com",
      familyName: "수지가족",
      password: "password-1234",
    });
  });

  it("builds a learner profile payload with a normalized pin", () => {
    expect(
      buildCreateLearnerProfileInput({
        learnerName: "  수지 ",
        learnerPin: "1 2-3a4",
        grade: "middle-1",
      }),
    ).toEqual({
      learnerName: "수지",
      learnerPin: "1234",
      grade: "middle-1",
    });
  });

  it("rejects learner profile input when pin is not four digits", () => {
    expect(() =>
      buildCreateLearnerProfileInput({
        learnerName: "수지",
        learnerPin: "12",
        grade: "middle-1",
      }),
    ).toThrow("Learner PIN must be exactly 4 digits.");
  });
});
