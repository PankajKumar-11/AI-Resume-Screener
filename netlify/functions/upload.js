// Netlify Function proxy to forward uploads to Railway (n8n webhook)
// Handles CORS (including OPTIONS) and binary multipart bodies

//const DEFAULT_TARGET = 'https://ai-resume-screener-production.up.railway.app/webhook/ai-resume-upload';
const DEFAULT_TARGET = 'https://posttoxic-zanily-lara.ngrok-free.dev/webhook/ai-resume-upload';


function corsHeaders(origin) {
  const allowOrigin = origin || '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Accept,Content-Type,Content-Length,Authorization,Origin,Referer,User-Agent,Cache-Control,X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
  };
}

exports.handler = async (event, context) => {
  const origin = event.headers?.origin || event.headers?.Origin || '*';

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(origin), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(origin), body: 'Method Not Allowed' };
  }

  try {
    const targetUrl = process.env.RAILWAY_WEBHOOK_URL || DEFAULT_TARGET;

    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || 'application/octet-stream';
    const isBase64 = !!event.isBase64Encoded;
    const rawBody = event.body || '';
    const bodyBuffer = Buffer.from(rawBody, isBase64 ? 'base64' : 'utf8');

    const resp = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(bodyBuffer.length),
        'x-proxy-via': 'netlify-function',
        'x-forwarded-host': event.headers.host || '',
        'x-forwarded-origin': origin || '',
      },
      body: bodyBuffer,
    });

    const text = await resp.text();
    const headers = Object.fromEntries(resp.headers);

    return {
      statusCode: resp.status,
      headers: {
        ...corsHeaders(origin),
        'content-type': headers['content-type'] || 'text/plain; charset=utf-8',
      },
      body: text,
    };
  } catch (err) {
  console.error('Upload proxy error:', err);

  // DEMO FALLBACK MODE
  return {
    statusCode: 200,
    headers: corsHeaders(origin),
    body: JSON.stringify({
      demo: true,
      message: "Backend offline — demo mode response"
    }),
  };
}

};
