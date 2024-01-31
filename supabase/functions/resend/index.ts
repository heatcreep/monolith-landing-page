import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const handler = async (_request: Request): Promise<Response> => {
  // Create supabase client
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            ...corsHeaders,
            Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
          },
        },
        auth: {
          autoRefreshToken: true,
        },
      },
    );
    // Handle CORS preflight request
    if (_request.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    // Get email from request body
    const { email } = await _request.json();

    // Get list of users that match email (should only be one)
    const { data: user, error: userError } = await supabase.from("profiles")
      .select("*")
      .eq("email", email);

    if (userError) throw userError;

    // If user exists, send email with link to delete account
    if (user !== null && user.length > 0) {
      const userId = user[0].id;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "account-services@monolith-app.dev",
          to: email,
          subject: "Monolith App - Confirm Account Deletion",
          html:
            `<strong>
            <a href="http://localhost:3000/api/delete-user?userId=${userId}">Confirm Delete Account</a>
            </strong>`,
        }),
      });
      
      // Return success response
      return new Response(JSON.stringify("Success!"), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
          "Content-Type": "application/json",
        },
      });
    } else {
      // If user list is empty, return error
      return new Response(JSON.stringify("User not found"), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
};

Deno.serve(handler);
