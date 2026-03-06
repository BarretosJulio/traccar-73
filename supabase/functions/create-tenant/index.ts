import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function generateSlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 30);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { company_name, traccar_url, owner_email, color_primary, color_secondary } = body;

    // Validation
    if (!company_name || !traccar_url || !owner_email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Campos obrigatórios: company_name, traccar_url, owner_email",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner_email)) {
      return new Response(
        JSON.stringify({ success: false, message: "Email inválido" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate Traccar URL
    const cleanUrl = traccar_url.replace(/\/$/, "");
    try {
      new URL(cleanUrl);
    } catch {
      return new Response(
        JSON.stringify({ success: false, message: "URL do Traccar inválida" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if email already has a tenant
    const { data: existing } = await supabaseAdmin
      .from("tenants")
      .select("id")
      .eq("owner_email", owner_email)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Já existe uma conta com este email",
        }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate unique slug
    let slug = generateSlug(company_name);
    const { data: slugCheck } = await supabaseAdmin
      .from("tenants")
      .select("id")
      .eq("slug", slug)
      .single();

    if (slugCheck) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    // Create tenant with trial
    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: tenant, error } = await supabaseAdmin
      .from("tenants")
      .insert({
        company_name,
        traccar_url: cleanUrl,
        owner_email,
        slug,
        color_primary: color_primary || "#1a73e8",
        color_secondary: color_secondary || "#ffffff",
        subscription_status: "trial",
        plan_type: "basic",
        trial_ends_at: trialEndsAt,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating tenant:", error);
      return new Response(
        JSON.stringify({ success: false, message: "Erro ao criar conta" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Conta criada com sucesso!",
        data: {
          slug: tenant.slug,
          company_name: tenant.company_name,
          trial_ends_at: tenant.trial_ends_at,
        },
      }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Create tenant error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Erro interno" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
