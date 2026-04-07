import { z } from "zod";

export const tutorReplySchema = z.object({
  message: z.string().min(1),
  mode: z.enum(["free-tutor", "guided-recovery"]),
  conceptTags: z.array(z.string()).default([]),
  nextQuestion: z.string().min(1),
});

export const parentReportSchema = z.object({
  learnerName: z.string().min(1),
  sessionSummary: z.string().min(1),
  blockedConcepts: z.array(z.string()).default([]),
  confidenceNotes: z.array(z.string()).default([]),
  nextRecommendations: z.array(z.string()).default([]),
});

export const learnerPinSessionSchema = z.object({
  sessionToken: z.string().min(1),
  learnerId: z.string().min(1),
  learnerName: z.string().min(1),
  grade: z.enum(["middle-1", "middle-2", "middle-3"]),
  expiresAt: z.string().min(1),
});

export const tutorTurnResultSchema = z.object({
  sessionId: z.string().min(1),
  sessionStatus: z.enum(["active", "completed"]).default("active"),
  tutorReply: tutorReplySchema,
  parentReport: parentReportSchema,
});

export type TutorReply = z.infer<typeof tutorReplySchema>;
export type ParentReport = z.infer<typeof parentReportSchema>;
export type LearnerPinSession = z.infer<typeof learnerPinSessionSchema>;
export type TutorTurnResult = z.infer<typeof tutorTurnResultSchema>;
