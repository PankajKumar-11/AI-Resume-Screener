// Netlify Function proxy for forwarding resume uploads to n8n webhook
// Preserves multipart binary stream correctly

const DEFAULT_TARGET =
  "https://ai-resume-screener-production.up.railway.app/webhook/ai-resume-upload";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers":
      "Accept,Content-Type,Authorization,Origin,Referer,User-Agent",
    "Access-Control-Allow-Credentials": "true",
  };
}

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "*";

  // ---- CORS preflight ----
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders(origin),
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders(origin),
      body: "Method Not Allowed",
    };
  }

  try {
    const targetUrl =
      process.env.RAILWAY_WEBHOOK_URL || DEFAULT_TARGET;

    const contentType =
      event.headers["content-type"] ||
      event.headers["Content-Type"] ||
      "application/octet-stream";

    // ✅ Preserve raw multipart binary correctly
    const body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : event.body;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "x-proxy-via": "netlify-function",
      },
      body: body,
    });

    const responseText = await response.text();

    return {
      statusCode: response.status,
      headers: {
        ...corsHeaders(origin),
        "Content-Type":
          response.headers.get("content-type") ||
          "application/json",
      },
      body: responseText,
    };
  } catch (error) {
    console.error("Upload proxy error:", error);

    return {
      statusCode: 502,
      headers: corsHeaders(origin),
      body: JSON.stringify({
        error: "Backend unreachable",
        detail: error.message,
      }),
    };
  }
};
