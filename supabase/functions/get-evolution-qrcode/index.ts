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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { instance_id } = await req.json();

    if (!instance_id) {
      return new Response(JSON.stringify({ success: false, error: 'instance_id obrigatório' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: instance, error: instErr } = await supabase
      .from('whatsapp_instances')
      .select('*, whatsapp_instance_secrets(*)')
      .eq('id', instance_id)
      .single();

    if (instErr || !instance) {
      return new Response(JSON.stringify({ success: false, error: 'Instância não encontrada' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const secrets = (instance as any).whatsapp_instance_secrets;
    if (!secrets || !secrets.api_url || !secrets.api_key) {
      return new Response(JSON.stringify({ success: false, error: 'Credenciais da instância não encontradas' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const baseUrl = secrets.api_url.replace(/\/$/, '');
    const instanceToken = String(secrets.api_key).trim();

    const buildTokenUrl = (path: string) => {
      const url = new URL(`${baseUrl}${path}`);
      url.searchParams.set('token', instanceToken);
      return url.toString();
    };

    const tokenHeaders = {
      'Content-Type': 'application/json',
      token: instanceToken,
      Token: instanceToken,
    };

    // 1) Verificar status atual
    const stateRes = await fetch(buildTokenUrl('/instance/status'), {
      method: 'GET',
      headers: tokenHeaders,
    });

    let currentState = 'disconnected';
    let statePayload: any = null;
    if (stateRes.ok) {
      const stateText = await stateRes.text();
      statePayload = parseJsonSafe(stateText);
      currentState = extractStatus(statePayload);
    }

    console.log(`[get-uazapi-qrcode] Instance ${instance.instance_name} state: ${currentState}`);

    if (isConnectedStatus(currentState)) {
      await supabase.from('whatsapp_instances')
        .update({ status: 'connected', qr_code: null, updated_at: new Date().toISOString() })
        .eq('id', instance_id);

      return new Response(JSON.stringify({ success: true, connected: true, status: 'connected', qr_code: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2) Pedir conexão (UAZAPI moderna retorna QR aqui)
    let qrCode: string | null = extractQrCode(statePayload);
    let connected = false;

    const connectRes = await fetch(buildTokenUrl('/instance/connect'), {
      method: 'POST',
      headers: tokenHeaders,
      body: JSON.stringify({}),
    });

    const connectText = await connectRes.text();
    console.log(`[get-uazapi-qrcode] Connect response (${connectRes.status}): ${connectText.substring(0, 300)}`);

    const connectPayload = parseJsonSafe(connectText);
    const connectState = extractStatus(connectPayload);
    qrCode = qrCode || extractQrCode(connectPayload);
    connected = isConnectedStatus(connectState);

    // 3) Fallback legado: /instance/qr
    if (!qrCode && !connected) {
      const qrRes = await fetch(buildTokenUrl('/instance/qr'), {
        method: 'GET',
        headers: tokenHeaders,
      });
      const qrText = await qrRes.text();
      console.log(`[get-uazapi-qrcode] QR response (${qrRes.status}): ${qrText.substring(0, 300)}`);

      const qrPayload = parseJsonSafe(qrText);
      qrCode = extractQrCode(qrPayload);
      connected = isConnectedStatus(extractStatus(qrPayload));
    }

    const finalStatus = connected ? 'connected' : (qrCode ? 'qr_required' : 'disconnected');

    await supabase.from('whatsapp_instances')
      .update({
        status: finalStatus,
        qr_code: connected ? null : qrCode,
        updated_at: new Date().toISOString(),
      })
      .eq('id', instance_id);

    return new Response(JSON.stringify({
      success: true,
      connected,
      status: finalStatus,
      qr_code: connected ? null : qrCode,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('[get-uazapi-qrcode] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});