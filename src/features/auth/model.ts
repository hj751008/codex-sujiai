export type ParentAccountDraft = {
  email: string;
  familyName: string;
};

export type ParentAccountInput = ParentAccountDraft & {
  password: string;
};

export type LearnerProfileDraft = {
  learnerName: string;
  learnerPin: string;
  grade: "middle-1" | "middle-2" | "middle-3";
};

export const gradeOptions = [
  { label: "중1", value: "middle-1" },
  { label: "중2", value: "middle-2" },
  { label: "중3", value: "middle-3" },
] as const;

export function normalizeLearnerPin(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 4);
}

export function buildParentAccountInput(
  draft: ParentAccountDraft,
  password: string,
): ParentAccountInput {
  return {
    email: draft.email.trim().toLowerCase(),
    familyName: draft.familyName.trim(),
    password,
  };
}

export function buildCreateLearnerProfileInput(
  draft: LearnerProfileDraft,
): LearnerProfileDraft {
  const learnerPin = normalizeLearnerPin(draft.learnerPin);

  if (learnerPin.length !== 4) {
    throw new Error("Learner PIN must be exactly 4 digits.");
  }

  return {
    learnerName: draft.learnerName.trim(),
    learnerPin,
    grade: draft.grade,
  };
}
