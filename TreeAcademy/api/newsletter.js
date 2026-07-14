import { subscribeWithResend } from "../lib/newsletter.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Method not allowed." });
  }

  // Log whether Resend config is present (do not log secret values)
  try {
    console.log("RESEND config", { fromSet: Boolean(process.env.RESEND_FROM), apiKeySet: Boolean(process.env.RESEND_API_KEY) });
  } catch (e) {
    // ignore logging failures
  }

  const email = typeof request.body?.email === "string" ? request.body.email.trim() : "";
  if (!/^\S+@\S+\.\S+$/.test(email)) return response.status(400).json({ message: "Please enter a valid email address." });
  try {
    await subscribeWithResend(email);
    return response.status(201).json({ message: "Thank you! Please check your inbox for a confirmation email." });
  } catch (error) {
    console.error("Newsletter subscription failed:", error && (error.stack || error));
    const status = error.message === "Resend newsletter service is not configured yet." ? 503 : 500;
    return response.status(status).json({ message: error.message || "We could not subscribe you right now. Please try again." });
  }
}
