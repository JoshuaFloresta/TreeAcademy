import { subscribeWithResend } from "../lib/newsletter.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Method not allowed." });
  }

  const email = typeof request.body?.email === "string" ? request.body.email.trim() : "";
  if (!/^\S+@\S+\.\S+$/.test(email)) return response.status(400).json({ message: "Please enter a valid email address." });
  try {
    await subscribeWithResend(email);
    return response.status(201).json({ message: "Thank you! Please check your inbox for a confirmation email." });
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
    const status = error.message === "Resend newsletter service is not configured yet." ? 503 : 500;
    return response.status(status).json({ message: error.message || "We could not subscribe you right now. Please try again." });
  }
}
