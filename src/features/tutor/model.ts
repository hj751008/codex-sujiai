import type { TutorReply } from "@/lib/ai/contracts";

export type TutorTranscriptEntry = {
  role: "learner" | "tutor";
  text: string;
};

export type TutorSessionTurnDraft = {
  sessionToken: string;
  sessionId?: string;
  unitId: string;
  learnerMessage: string;
};

export function buildTutorSessionTurnInput(
  draft: TutorSessionTurnDraft,
): TutorSessionTurnDraft {
  return {
    sessionToken: draft.sessionToken.trim(),
    sessionId: draft.sessionId?.trim() || undefined,
    unitId: draft.unitId.trim(),
    learnerMessage: draft.learnerMessage.trim(),
  };
}

export function appendTutorReplyToTranscript(
  transcript: TutorTranscriptEntry[],
  learnerMessage: string,
  tutorReply: TutorReply,
): TutorTranscriptEntry[] {
  return [
    ...transcript,
    { role: "learner", text: learnerMessage },
    { role: "tutor", text: tutorReply.message },
  ];
}
