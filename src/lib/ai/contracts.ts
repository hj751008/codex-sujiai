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

export type TutorReply = z.infer<typeof tutorReplySchema>;
export type ParentReport = z.infer<typeof parentReportSchema>;
