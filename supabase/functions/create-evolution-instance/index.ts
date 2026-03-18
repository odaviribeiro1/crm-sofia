import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const parseJsonSafe = (input: string) => {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
};

const extractStatus = (payload: any): string => {
  const candidates = [
    payload?.status,
    payload?.state,
    payload?.connection,
    payload?.instance?.status,
    payload?.instance?.state,
    payload?.data?.status,
    payload?.data?.state,
  ];

  const status = candidates.find((v) => typeof v === 'string' && v.trim().length > 0);
  return status ? String(status).toLowerCase() : 'disconnected';
};

const isConnectedStatus = (status: string): boolean => {
  const normalized = status.toLowerCase();
  return normalized === 'connected' || normalized === 'open';
};

const extractQrCode = (payload: any): string | null => {
  const candidates = [
    payload?.qrCode,
    payload?.qrcode,
    payload?.base64,
    payload?.qrcode?.base64,
    payload?.instance?.qrCode,
    payload?.instance?.qrcode,
    payload?.instance?.base64,
    payload?.instance?.qrcode?.base64,
    payload?.data?.qrCode,
    payload?.data?.qrcode,
    payload?.data?.base64,
    payload?.data?.qrcode?.base64,
  ];

  const qr = candidates.find((v) => typeof v === 'string' && v.trim().length > 0);
  return qr ? String(qr) : null;
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
    const adminToken = String(api_key).trim();

    const adminHeaders = {
      'Content-Type': 'application/json',
      admintoken: adminToken,
      AdminToken: adminToken,
    };

    const buildAdminUrl = (path: string) => {
      const url = new URL(`${baseUrl}${path}`);
      url.searchParams.set('admintoken', adminToken);
      return url.toString();
    };

    // 1. Criar instância na UAZAPI
    console.log(`[create-uazapi-instance] Creating instance: ${instance_name} at ${baseUrl}`);
    const createRes = await fetch(buildAdminUrl('/instance/init'), {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ Name: instance_name, name: instance_name }),
    });

    const createText = await createRes.text();
    console.log(`[create-uazapi-instance] Create response (${createRes.status}): ${createText.substring(0, 500)}`);

    const createData = parseJsonSafe(createText) ?? {};

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
    const instanceToken = [
      createData?.token,
      createData?.instance?.token,
      createData?.data?.token,
    ].find((v) => typeof v === 'string' && v.trim().length > 0);

    if (!instanceToken) {
      return new Response(JSON.stringify({
        success: false,
        error: 'UAZAPI não retornou token da instância recém-criada',
        details: createText,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const tokenHeaders = {
      'Content-Type': 'application/json',
      token: instanceToken,
      Token: instanceToken,
    };

    const buildTokenUrl = (path: string) => {
      const url = new URL(`${baseUrl}${path}`);
      url.searchParams.set('token', instanceToken);
      return url.toString();
    };

    // 2. Buscar QR Code
    let qrCode: string | null = extractQrCode(createData);
    let connected = isConnectedStatus(extractStatus(createData));

    if (!qrCode && !connected) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // UAZAPI v2: /instance/connect devolve QR
      const connectRes = await fetch(buildTokenUrl('/instance/connect'), {
        method: 'POST',
        headers: tokenHeaders,
        body: JSON.stringify({}),
      });

      const connectText = await connectRes.text();
      console.log(`[create-uazapi-instance] Connect response (${connectRes.status}): ${connectText.substring(0, 300)}`);
      const connectData = parseJsonSafe(connectText);

      qrCode = qrCode || extractQrCode(connectData);
      connected = connected || isConnectedStatus(extractStatus(connectData));

      // Fallback legado
      if (!qrCode && !connected) {
        const qrRes = await fetch(buildTokenUrl('/instance/qr'), {
          method: 'GET',
          headers: tokenHeaders,
        });

        const qrText = await qrRes.text();
        console.log(`[create-uazapi-instance] QR fallback (${qrRes.status}): ${qrText.substring(0, 200)}`);
        const qrData = parseJsonSafe(qrText);

        qrCode = extractQrCode(qrData);
        connected = isConnectedStatus(extractStatus(qrData));
      }
    }

    // 3. Salvar no banco
    const { data: instance, error: insertError } = await supabase
      .from('whatsapp_instances')
      .insert({
        name,
        instance_name,
        provider_type: 'evolution_self_hosted',
        status: connected ? 'connected' : (qrCode ? 'qr_required' : 'disconnected'),
        qr_code: connected ? null : qrCode,
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

    // 4. Salvar secrets (sempre token da instância)
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

    // 5. Configurar webhook (não bloqueante)
    const webhookUrl = `${supabaseUrl}/functions/v1/evolution-webhook`;
    try {
      const webhookRes = await fetch(buildTokenUrl('/webhook/set'), {
        method: 'POST',
        headers: tokenHeaders,
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
      qr_code: connected ? null : qrCode,
      status: connected ? 'connected' : (qrCode ? 'qr_required' : 'disconnected'),
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