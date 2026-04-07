import { describe, expect, it } from "vitest";
import {
  appendTutorReplyToTranscript,
  buildTutorSessionTurnInput,
} from "./model";

describe("tutor model", () => {
  it("builds a tutor turn request with trimmed learner input", () => {
    expect(
      buildTutorSessionTurnInput({
        sessionToken: "token-1",
        unitId: "literal-expressions",
        learnerMessage: "  문장을 식으로 못 바꾸겠어  ",
        sessionId: "session-1",
      }),
    ).toEqual({
      sessionToken: "token-1",
      sessionId: "session-1",
      unitId: "literal-expressions",
      learnerMessage: "문장을 식으로 못 바꾸겠어",
    });
  });

  it("appends learner and tutor messages in order", () => {
    const transcript = appendTutorReplyToTranscript(
      [],
      "문자 하나가 뭔지 모르겠어",
      {
        message: "문자가 무엇을 대신하는지 먼저 말로 바꿔보자.",
        mode: "guided-recovery",
        conceptTags: ["문자와 식"],
        nextQuestion: "여기서 x가 대신하는 말을 한 문장으로 말해볼래?",
      },
    );

    expect(transcript).toEqual([
      { role: "learner", text: "문자 하나가 뭔지 모르겠어" },
      {
        role: "tutor",
        text: "문자가 무엇을 대신하는지 먼저 말로 바꿔보자.",
      },
    ]);
  });
});
