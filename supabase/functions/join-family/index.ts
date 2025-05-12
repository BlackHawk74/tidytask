import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { familyCode } = await req.json();
    if (!familyCode || typeof familyCode !== 'string' || familyCode.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Family code is required and must be a non-empty string." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const trimmedFamilyCode = familyCode.trim();

    // 1. Find the family by family_code
    const { data: familyData, error: familyError } = await supabaseClient
      .from("families")
      .select("id, name")
      .eq("family_code", trimmedFamilyCode)
      .single();

    if (familyError || !familyData) {
      console.error("Error finding family or family not found:", familyError);
      const userMessage = familyError && familyError.code === 'PGRST116' ? 
        "Invalid family code. Please check the code and try again." : 
        "Could not find a family with that code.";
      return new Response(JSON.stringify({ error: userMessage }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404, // Not Found or Bad Request if code format is wrong
      });
    }

    const familyId = familyData.id;
    const familyName = familyData.name;

    // 2. Check if user is already a member of this family
    const { data: existingMember, error: memberCheckError } = await supabaseClient
      .from("family_members")
      .select("id")
      .eq("family_id", familyId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (memberCheckError) {
      console.error("Error checking existing family membership:", memberCheckError);
      return new Response(JSON.stringify({ error: "Error checking family membership." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (existingMember) {
      return new Response(JSON.stringify({ error: `You are already a member of '${familyName}'.` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 409, // Conflict
      });
    }
    
    // 3. Get user's profile details (color_theme for family_members table)
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('color_theme')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
        console.error("Error fetching user profile data for family member entry:", userError);
        return new Response(JSON.stringify({ error: "Could not fetch your profile details to join the family." }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }


    // 4. Add user to the family
    const { error: insertError } = await supabaseClient
      .from("family_members")
      .insert({
        family_id: familyId,
        user_id: user.id,
        role: "member", // Default role for joining
        color_theme: userData.color_theme, // User's color theme
      });

    if (insertError) {
      console.error("Error adding user to family:", insertError);
      return new Response(JSON.stringify({ error: "Failed to add you to the family." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: `Successfully joined family: ${familyName}!` , familyId: familyId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Unexpected error in join-family function:", error);
    return new Response(JSON.stringify({ error: error.message || "An unexpected error occurred." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
