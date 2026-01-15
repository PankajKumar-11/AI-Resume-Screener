

const DEFAULT_TARGET = "https://posttoxic-zanily-lara.ngrok-free.dev/webhook/ai-resume-upload";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

exports.handler = async (event) => {
  const origin = event.headers.origin || "*";

  // CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders(origin),
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 200,
      headers: corsHeaders(origin),
      body: "OK",
    };
  }

  const targetUrl = DEFAULT_TARGET;

  try {
    // Timeout after 5 seconds
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(targetUrl, {
      method: "POST",
      body: event.body,
      headers: {
        "Content-Type": event.headers["content-type"] || "application/octet-stream",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // If backend responds correctly
    if (response.ok) {
      const text = await response.text();
      return {
        statusCode: 200,
        headers: corsHeaders(origin),
        body: text,
      };
    }

    // Backend error → demo mode
    throw new Error("Backend error");

  } catch (err) {
    console.log("Demo fallback active");

    // ALWAYS return 200 demo response
    return {
      statusCode: 200,
      headers: corsHeaders(origin),
      body: JSON.stringify({
        demo: true,
        message: "Backend offline — demo mode active",
      }),
    };
  }
};
