import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { instance_id, groups_ignore, reject_call, msg_call, always_online, read_messages, webhook_enabled } = await req.json();

    if (!instance_id || groups_ignore === undefined) {
      return new Response(JSON.stringify({ success: false, error: 'Campos obrigatórios: instance_id, groups_ignore' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: instance, error: instanceError } = await supabase
      .from('whatsapp_instances').select('instance_name, provider_type').eq('id', instance_id).single();

    if (instanceError || !instance) {
      return new Response(JSON.stringify({ success: false, error: 'Instância não encontrada' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: secrets, error: secretsError } = await supabase
      .from('whatsapp_instance_secrets').select('api_url, api_key').eq('instance_id', instance_id).single();

    if (secretsError || !secrets) {
      return new Response(JSON.stringify({ success: false, error: 'Credenciais da instância não encontradas' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const baseUrl = secrets.api_url.replace(/\/$/, '');
    const instanceHeaders = { 'Content-Type': 'application/json', 'Token': secrets.api_key };

    const payload = {
      rejectCall: reject_call ?? false,
      msgCall: reject_call ? (msg_call ?? '') : '',
      groupsIgnore: groups_ignore,
      alwaysOnline: always_online ?? false,
      readMessages: read_messages ?? false,
    };

    console.log(`[update-uazapi-settings] Updating settings for ${instance.instance_name}:`, payload);

    const res = await fetch(`${baseUrl}/instance/settings`, {
      method: 'POST',
      headers: instanceHeaders,
      body: JSON.stringify(payload),
    });

    const resText = await res.text();
    console.log(`[update-uazapi-settings] Response (${res.status}): ${resText.substring(0, 300)}`);

    if (!res.ok) {
      return new Response(JSON.stringify({
        success: false, error: `UAZAPI respondeu ${res.status}: ${resText.substring(0, 200)}`,
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (webhook_enabled !== undefined) {
      const webhookUrl = `${supabaseUrl}/functions/v1/evolution-webhook`;
      if (webhook_enabled) {
        const webhookRes = await fetch(`${baseUrl}/webhook/set`, {
          method: 'POST', headers: instanceHeaders, body: JSON.stringify({ url: webhookUrl }),
        });
        const webhookText = await webhookRes.text();
        console.log(`[update-uazapi-settings] Webhook response (${webhookRes.status}): ${webhookText.substring(0, 300)}`);
      } else {
        const webhookRes = await fetch(`${baseUrl}/webhook/delete`, {
          method: 'DELETE', headers: instanceHeaders,
        });
        const webhookText = await webhookRes.text();
        console.log(`[update-uazapi-settings] Webhook delete response (${webhookRes.status}): ${webhookText.substring(0, 300)}`);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('[update-uazapi-settings] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});