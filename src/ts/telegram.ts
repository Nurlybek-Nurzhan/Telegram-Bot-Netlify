import type { FormData, ApiResponse } from "./types";

// ==============================================
// CONFIGURATION
// ==============================================

// Points to Netlify serverless function
const API_ENDPOINT = "/.netlify/functions/send-telegram";

// ==============================================
// API CALL
// ==============================================

/**
 * Sends premium request to Netlify function
 * The function then forwards to Telegram (keeps token secure)
 */
export async function sendPremiumRequest(data: FormData): Promise<ApiResponse> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to send request");
    }

    return {
      success: true,
      message: result.message || "Request sent successfully!",
    };
  } catch (error) {
    console.error("API error:", error);

    return {
      success: false,
      message: "Failed to send request. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
