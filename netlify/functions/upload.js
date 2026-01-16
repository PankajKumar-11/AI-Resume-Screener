// Netlify Function proxy to forward uploads to n8n webhook
// Supports binary multipart + role forwarding + CORS

const DEFAULT_TARGET =
  "https://posttoxic-zanily-lara.ngrok-free.dev/webhook/ai-resume-upload";

function corsHeaders(origin) {
  const allowOrigin = origin || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    Vary: "Origin",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers":
      "Accept,Content-Type,Content-Length,Authorization,Origin,Referer,User-Agent,Cache-Control,X-Requested-With,X-Job-Role",
    "Access-Control-Allow-Credentials": "true",
  };
}

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "*";

  // CORS preflight
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
    const targetUrl = process.env.RAILWAY_WEBHOOK_URL || DEFAULT_TARGET;

    const contentType =
      event.headers["content-type"] ||
      event.headers["Content-Type"] ||
      "application/octet-stream";

    const roleHeader =
      event.headers["x-job-role"] || event.headers["X-Job-Role"] || "";

    const isBase64 = !!event.isBase64Encoded;
    const rawBody = event.body || "";

    const bodyBuffer = Buffer.from(rawBody, isBase64 ? "base64" : "utf8");

    const resp = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(bodyBuffer.length),

        // meta headers
        "x-proxy-via": "netlify-function",
        "x-forwarded-origin": origin || "",
        "x-job-role": roleHeader, // optional backup role channel
      },
      body: bodyBuffer,
    });

    const text = await resp.text();
    const headers = Object.fromEntries(resp.headers);

    const formData = new FormData();

    formData.append("resume", file); // IMPORTANT
    formData.append("role", role); // Your new feature

    fetch("/.netlify/functions/upload", {
      method: "POST",
      body: formData,
    });

    return {
      statusCode: resp.status,
      headers: {
        ...corsHeaders(origin),
        "content-type": headers["content-type"] || "application/json",
      },
      body: text,
    };
  } catch (err) {
    console.error("Upload proxy error:", err);

    // fallback demo response
    return {
      statusCode: 200,
      headers: corsHeaders(origin),
      body: JSON.stringify({
        demo: true,
        message: "Backend offline — demo mode response",
      }),
    };
  }
};
