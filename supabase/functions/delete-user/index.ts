import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (_req: Request) => {
  try {
    // Create supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: {
            ...corsHeaders,
            Authorization: `Bearer ${
              Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
            }`,
          },
        },
        auth: {
          autoRefreshToken: true,
        },
      },
    );

    // Get user id from request body
    const { userId } = await _req.json();

    // Delete user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) throw deleteError;

    return new Response(JSON.stringify(String("Success")), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: unknown) {
    // Handle errors
    if(err instanceof Error) {
      return new Response(String(err?.message ?? err), { status: 500 });  
    } else {
      return new Response(String(err), { status: 500 });
    }
    
  }
});
