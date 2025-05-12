// supabase/functions/create-family/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts' // You'll create this shared CORS file
// Define Role enum - ensure this matches your src/lib/types.ts or is centrally managed
enum Role {
  Admin = 'Admin',
  Member = 'Member',
}

interface Family {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  family_code: string;
}

serve(async (req: Request) => {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged-in user.
    // The SUPABASE_URL and SUPABASE_ANON_KEY are automatically available in Edge Functions.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the currently logged-in user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      console.error('User auth error:', userError)
      return new Response(JSON.stringify({ error: 'Authentication required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Get familyName from the request body
    const { familyName } = await req.json()
    if (!familyName || typeof familyName !== 'string' || familyName.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Family name is required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 1. Generate a unique family code by calling the database function
    const { data: codeData, error: codeError } = await supabaseClient.rpc('generate_unique_family_code')
    if (codeError || !codeData) {
      console.error('Error generating family code:', codeError)
      throw new Error(codeError?.message || 'Failed to generate family code.')
    }
    const familyCode = codeData as string;

    // 2. Create the new family in the 'families' table
    const { data: newFamily, error: familyInsertError } = await supabaseClient
      .from('families')
      .insert({
        name: familyName.trim(),
        created_by: user.id,
        family_code: familyCode,
      })
      .select()
      .single<Family>() // Specify the expected return type

    if (familyInsertError || !newFamily) {
      console.error('Error inserting family:', familyInsertError)
      throw new Error(familyInsertError?.message || 'Could not create the family record.')
    }

    // 3. Add the creator as the first family member (Admin)
    // Use a default color_theme or allow user to select one on client and pass it.
    const defaultColorTheme = '#4F46E5'; // Example default
    const { error: memberInsertError } = await supabaseClient
      .from('family_members')
      .insert({
        family_id: newFamily.id,
        user_id: user.id,
        role: Role.Admin, 
        color_theme: defaultColorTheme,
      })

    if (memberInsertError) {
      // Potentially attempt to delete the created family if adding member fails (for cleanup)
      // This adds complexity; for now, we'll log and report.
      console.error('Error inserting family member:', memberInsertError)
      // Consider if the family record should be deleted if this step fails.
      // await supabaseClient.from('families').delete().eq('id', newFamily.id);
      throw new Error(memberInsertError.message || 'Could not add you as a member to the new family.')
    }

    // Return the newly created family details and the family code
    return new Response(JSON.stringify({ family: newFamily, familyCode: familyCode }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) { // Type 'error' as 'any'
    console.error('Unhandled error in create-family function:', error)
    return new Response(JSON.stringify({ error: error.message || 'An unexpected error occurred.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})