import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  console.log(`[create-uazapi-instance] Received ${req.method} request`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { api_url, api_key, instance_name, name, is_default } = await req.json();

    if (!api_url || !api_key || !instance_name || !name) {
      return new Response(JSON.stringify({ success: false, error: 'Campos obrigatórios: api_url, api_key, instance_name, name' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const baseUrl = api_url.replace(/\/$/, '');

    // 1. Criar instância na UAZAPI - AdminToken via header, body com "Name"
    console.log(`[create-uazapi-instance] Creating instance: ${instance_name} at ${baseUrl}`);
    const createRes = await fetch(`${baseUrl}/instance/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'AdminToken': api_key,
      },
      body: JSON.stringify({ Name: instance_name }),
    });

    const createText = await createRes.text();
    console.log(`[create-uazapi-instance] Create response (${createRes.status}): ${createText.substring(0, 500)}`);

    let createData: any = {};
    try { createData = JSON.parse(createText); } catch {}

    if (!createRes.ok && createRes.status !== 200 && createRes.status !== 201) {
      return new Response(JSON.stringify({
        success: false,
        error: `Erro ao criar instância na UAZAPI: ${createRes.status}`,
        details: createText,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extrair token da instância
    const instanceToken = createData?.token || createData?.instance?.token || api_key;

    // 2. Buscar QR Code
    let qrCode: string | null = null;
    qrCode = createData?.qrCode || createData?.qrcode?.base64 || createData?.base64 || null;

    if (!qrCode) {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const qrRes = await fetch(`${baseUrl}/instance/qr`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Token': instanceToken },
      });

      if (qrRes.ok) {
        const qrText = await qrRes.text();
        console.log(`[create-uazapi-instance] QR response: ${qrText.substring(0, 200)}`);
        try {
          const qrData = JSON.parse(qrText);
          qrCode = qrData?.qrCode || qrData?.base64 || qrData?.qrcode?.base64 || null;
        } catch {}
      }
    }

    // 3. Salvar no banco
    const { data: instance, error: insertError } = await supabase
      .from('whatsapp_instances')
      .insert({
        name,
        instance_name,
        provider_type: 'evolution_self_hosted',
        status: qrCode ? 'qr_required' : 'disconnected',
        qr_code: qrCode,
        is_default: is_default ?? false,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[create-uazapi-instance] DB insert error:', insertError);
      return new Response(JSON.stringify({ success: false, error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Salvar secrets
    const { error: secretsError } = await supabase
      .from('whatsapp_instance_secrets')
      .insert({
        instance_id: instance.id,
        api_url,
        api_key: instanceToken,
      });

    if (secretsError) {
      await supabase.from('whatsapp_instances').delete().eq('id', instance.id);
      return new Response(JSON.stringify({ success: false, error: secretsError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 5. Configurar webhook
    const webhookUrl = `${supabaseUrl}/functions/v1/evolution-webhook`;
    try {
      const webhookRes = await fetch(`${baseUrl}/webhook/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Token': instanceToken },
        body: JSON.stringify({ url: webhookUrl }),
      });
      const webhookText = await webhookRes.text();
      console.log(`[create-uazapi-instance] Webhook response (${webhookRes.status}): ${webhookText.substring(0, 300)}`);
    } catch (webhookErr) {
      console.warn('[create-uazapi-instance] Failed to set webhook (non-fatal):', webhookErr);
    }

    return new Response(JSON.stringify({
      success: true,
      instance_id: instance.id,
      qr_code: qrCode,
      status: instance.status,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('[create-uazapi-instance] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});