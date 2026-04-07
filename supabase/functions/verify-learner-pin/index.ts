// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { learnerId, learnerPin } = await request.json();

    if (!learnerId || !learnerPin) {
      return Response.json(
        { error: "learnerId and learnerPin are required." },
        { status: 400, headers: corsHeaders },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { data, error } = await supabase
      .rpc("verify_learner_pin", {
        p_learner_id: learnerId,
        p_pin: learnerPin,
      })
      .single();

    if (error) {
      throw error;
    }

    return Response.json(
      {
        sessionToken: data.session_token,
        learnerId: data.learner_id,
        learnerName: data.learner_name,
        grade: data.grade,
        expiresAt: data.expires_at,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    return Response.json(
      { error: error.message ?? "Learner PIN verification failed." },
      { status: 500, headers: corsHeaders },
    );
  }
});
