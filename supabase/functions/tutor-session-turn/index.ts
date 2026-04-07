// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const unitTitles = {
  "prime-factorization": "소인수분해",
  "integers-and-rational": "정수와 유리수",
  "literal-expressions": "문자와 식",
};

const tutorTurnSchema = {
  type: "object",
  additionalProperties: false,
  required: ["sessionStatus", "tutorReply", "parentReport"],
  properties: {
    sessionStatus: {
      type: "string",
      enum: ["active", "completed"],
    },
    tutorReply: {
      type: "object",
      additionalProperties: false,
      required: ["message", "mode", "conceptTags", "nextQuestion"],
      properties: {
        message: { type: "string" },
        mode: {
          type: "string",
          enum: ["free-tutor", "guided-recovery"],
        },
        conceptTags: {
          type: "array",
          items: { type: "string" },
        },
        nextQuestion: { type: "string" },
      },
    },
    parentReport: {
      type: "object",
      additionalProperties: false,
      required: [
        "learnerName",
        "sessionSummary",
        "blockedConcepts",
        "confidenceNotes",
        "nextRecommendations",
      ],
      properties: {
        learnerName: { type: "string" },
        sessionSummary: { type: "string" },
        blockedConcepts: {
          type: "array",
          items: { type: "string" },
        },
        confidenceNotes: {
          type: "array",
          items: { type: "string" },
        },
        nextRecommendations: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
  },
};

function buildTutorMessages(context) {
  return [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text:
            "You are Suji Math AI. Respond with JSON only. Keep the learner-facing tutor warm, one-step-at-a-time, and focused on helping the student recover the first step. Never copy textbook wording. Use webtoon-friendly metaphors lightly when helpful. Also create a parent report summary in Korean.",
        },
      ],
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: JSON.stringify(context),
        },
      ],
    },
  ];
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { sessionToken, sessionId, unitId, learnerMessage } =
      await request.json();

    if (!sessionToken || !unitId || !learnerMessage?.trim()) {
      return Response.json(
        { error: "sessionToken, unitId, learnerMessage are required." },
        { status: 400, headers: corsHeaders },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { data: learnerSession, error: learnerSessionError } = await supabase
      .rpc("resolve_learner_pin_session", {
        p_session_token: sessionToken,
      })
      .single();

    if (learnerSessionError || !learnerSession) {
      throw learnerSessionError ?? new Error("Learner session token is invalid.");
    }

    let currentSessionId = sessionId;

    if (!currentSessionId) {
      const { data: insertedSession, error: insertedSessionError } =
        await supabase
          .from("learner_sessions")
          .insert({
            learner_id: learnerSession.learner_id,
            parent_id: learnerSession.parent_id,
            unit_id: unitId,
            unit_title: unitTitles[unitId] ?? unitId,
          })
          .select("id")
          .single();

      if (insertedSessionError) {
        throw insertedSessionError;
      }

      currentSessionId = insertedSession.id;
    }

    await supabase.from("session_messages").insert({
      session_id: currentSessionId,
      speaker: "learner",
      content: learnerMessage.trim(),
    });

    const { data: previousMessages } = await supabase
      .from("session_messages")
      .select("speaker,content,concept_tags,next_question,created_at")
      .eq("session_id", currentSessionId)
      .order("created_at", { ascending: true });

    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: Deno.env.get("OPENAI_MODEL") ?? "gpt-5.4",
        input: buildTutorMessages({
          learnerName: learnerSession.learner_name,
          grade: learnerSession.grade,
          unitId,
          previousMessages: previousMessages ?? [],
          learnerMessage: learnerMessage.trim(),
        }),
        text: {
          format: {
            type: "json_schema",
            name: "suji_tutor_turn",
            strict: true,
            schema: tutorTurnSchema,
          },
        },
      }),
    });

    if (!openAiResponse.ok) {
      const failureText = await openAiResponse.text();
      throw new Error(`OpenAI request failed: ${failureText}`);
    }

    const openAiPayload = await openAiResponse.json();
    const outputText = openAiPayload.output_text;

    if (!outputText) {
      throw new Error("OpenAI response did not contain output_text.");
    }

    const parsed = JSON.parse(outputText);

    await supabase.from("session_messages").insert({
      session_id: currentSessionId,
      speaker: "tutor",
      content: parsed.tutorReply.message,
      concept_tags: parsed.tutorReply.conceptTags,
      next_question: parsed.tutorReply.nextQuestion,
    });

    await supabase.from("learner_sessions").update({
      latest_mode: parsed.tutorReply.mode,
      session_status: parsed.sessionStatus,
      completed_at:
        parsed.sessionStatus === "completed"
          ? new Date().toISOString()
          : null,
    }).eq("id", currentSessionId);

    const reportPayload = {
      session_id: currentSessionId,
      learner_id: learnerSession.learner_id,
      parent_id: learnerSession.parent_id,
      learner_name: parsed.parentReport.learnerName,
      session_summary: parsed.parentReport.sessionSummary,
      blocked_concepts: parsed.parentReport.blockedConcepts,
      confidence_notes: parsed.parentReport.confidenceNotes,
      next_recommendations: parsed.parentReport.nextRecommendations,
    };

    await supabase.from("session_reports").upsert(reportPayload, {
      onConflict: "session_id",
    });

    return Response.json(
      {
        sessionId: currentSessionId,
        sessionStatus: parsed.sessionStatus,
        tutorReply: parsed.tutorReply,
        parentReport: parsed.parentReport,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    return Response.json(
      { error: error.message ?? "Tutor session turn failed." },
      { status: 500, headers: corsHeaders },
    );
  }
});
