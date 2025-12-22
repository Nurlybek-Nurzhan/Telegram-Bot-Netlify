// Environment variables are automatically loaded by Netlify
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function escapeMarkdown(text) {
  // Escape special Markdown characters but keep + for phone numbers
  return text.replace(/[_*[\]()~`>#\-=|{}.!\\]/g, "\\$&");
}

function formatMessage(data) {
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `⭐ *PREMIUM ACCOUNT REQUEST*
━━━━━━━━━━━━━━━━━━━━━━━━

👤 *Full Name:* ${escapeMarkdown(data.fullName)}
📱 *Phone:* ${escapeMarkdown(data.phone)}
🏫 *School:* ${escapeMarkdown(data.school)}

━━━━━━━━━━━━━━━━━━━━━━━━
🕐 _Received: ${timestamp}_`;
}

function validateFormData(data) {
  if (!data || typeof data !== "object") return false;
  const { fullName, phone, school } = data;
  return (
    typeof fullName === "string" &&
    fullName.trim().length > 0 &&
    typeof phone === "string" &&
    phone.trim().length > 0 &&
    typeof school === "string" &&
    school.trim().length > 0
  );
}

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    console.error("BOT_TOKEN exists:", !!BOT_TOKEN);
    console.error("CHAT_ID exists:", !!CHAT_ID);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  console.log("Function invoked with chat_id:", CHAT_ID);

  let data;

  try {
    const parsed = JSON.parse(event.body || "{}");

    if (!validateFormData(parsed)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid form data" }),
      };
    }

    data = parsed;
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  try {
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: formatMessage(data),
        parse_mode: "Markdown",
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error("Telegram API error:", result.description);
      throw new Error(result.description || "Telegram API error");
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Request submitted successfully!",
      }),
    };
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    console.error("Error details:", error.message);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to send request",
        details: error.message
      }),
    };
  }
};
