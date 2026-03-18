import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`[send-uazapi-message] Attempt ${attempt + 1}/${retries}`);
      return await fetch(url, options);
    } catch (error) {
      if (attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
  throw new Error('All retries failed');
}

function normalizeBrazilianPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('55') && digits.length > 11) digits = digits.slice(2);
  if (digits.length < 10 || digits.length > 11) return null;
  if (digits.length === 10) {
    const firstDigit = parseInt(digits[2], 10);
    if (firstDigit >= 6) digits = digits.slice(0, 2) + '9' + digits.slice(2);
  }
  return '55' + digits;
}

interface SendMessageRequest {
  instance_id: string;
  phone_number: string;
  content: string;
  message_type?: 'text' | 'audio' | 'image' | 'document';
  media_url?: string;
  file_name?: string;
}

serve(async (req) => {
  console.log(`[send-uazapi-message] Received ${req.method} request`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body: SendMessageRequest = await req.json();
    const { instance_id, phone_number, content, message_type = 'text', media_url, file_name } = body;

    const { data: instance, error: instanceError } = await supabase
      .from('whatsapp_instances')
      .select('id, instance_name, status')
      .eq('id', instance_id)
      .single();

    if (instanceError || !instance) throw new Error('Instance not found');
    if (instance.status !== 'connected') throw new Error(`Instance not connected: ${instance.status}`);

    const { data: secrets, error: secretsError } = await supabase
      .from('whatsapp_instance_secrets')
      .select('api_url, api_key')
      .eq('instance_id', instance_id)
      .single();

    if (secretsError || !secrets) throw new Error('Instance secrets not found');

    const formattedNumber = normalizeBrazilianPhone(phone_number) ?? phone_number.replace(/\D/g, '');
    const baseUrl = secrets.api_url.replace(/\/$/, '');
    const instanceHeaders = { 'Content-Type': 'application/json', 'Token': secrets.api_key };

    let endpoint: string;
    let payload: any;

    switch (message_type) {
      case 'text':
        endpoint = `${baseUrl}/send/text`;
        payload = { number: formattedNumber, text: content };
        break;
      case 'audio':
        endpoint = `${baseUrl}/send/audio`;
        payload = { number: formattedNumber, audio: media_url };
        break;
      case 'image':
        endpoint = `${baseUrl}/send/media`;
        payload = { number: formattedNumber, mediatype: 'image', media: media_url, caption: content || '' };
        break;
      case 'document':
        endpoint = `${baseUrl}/send/media`;
        payload = { number: formattedNumber, mediatype: 'document', media: media_url, caption: content || '', fileName: file_name || 'document' };
        break;
      default:
        throw new Error(`Unsupported message type: ${message_type}`);
    }

    const response = await fetchWithRetry(endpoint, {
      method: 'POST',
      headers: instanceHeaders,
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log(`[send-uazapi-message] Response: ${response.status} - ${responseText.substring(0, 500)}`);

    if (!response.ok) throw new Error(`UAZAPI error: ${responseText}`);

    let responseData;
    try { responseData = JSON.parse(responseText); } catch { responseData = { raw: responseText }; }

    const messageId = responseData?.key?.id || responseData?.messageId || responseData?.id;

    return new Response(JSON.stringify({ success: true, messageId, data: responseData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('[send-uazapi-message] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});