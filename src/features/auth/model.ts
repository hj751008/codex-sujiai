export type ParentAccountDraft = {
  email: string;
  familyName: string;
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
