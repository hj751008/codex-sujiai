export type Grade = "middle-1" | "middle-2" | "middle-3";

export type ParentProfileRecord = {
  id: string;
  family_name: string;
  created_at: string;
};

export type LearnerProfileRecord = {
  id: string;
  parent_id: string;
  learner_name: string;
  grade: Grade;
  pin_hint: string;
  created_at: string;
};

export type CreateLearnerProfileRpcInput = {
  p_learner_name: string;
  p_grade: Grade;
  p_pin: string;
};

export type SessionReportRecord = {
  id: string;
  session_id: string;
  learner_id: string;
  parent_id: string;
  learner_name: string;
  session_summary: string;
  blocked_concepts: string[] | null;
  confidence_notes: string[] | null;
  next_recommendations: string[] | null;
  created_at: string;
};
