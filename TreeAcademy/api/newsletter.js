import nodemailer from "nodemailer";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Method not allowed." });
  }

  const email = typeof request.body?.email === "string" ? request.body.email.trim() : "";
  if (!/^\S+@\S+\.\S+$/.test(email)) return response.status(400).json({ message: "Please enter a valid email address." });
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return response.status(503).json({ message: "Newsletter email service is not configured yet. Please try again later." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    await transporter.sendMail({
      from,
      to: email,
      subject: "Welcome to the TREE Academy newsletter",
      text: "Thank you for subscribing to TREE Academy. We will send you updates on review programs, masterclasses, and practical real estate learning resources.",
      html: "<h2>Welcome to TREE Academy</h2><p>Thank you for subscribing. We will send you updates on review programs, masterclasses, and practical real estate learning resources.</p>",
    });
    await transporter.sendMail({
      from,
      to: "trainwithmastersonline@gmail.com",
      replyTo: email,
      subject: "New TREE Academy newsletter subscriber",
      text: `New newsletter subscriber: ${email}`,
    });
    return response.status(201).json({ message: "Thank you! Please check your inbox for a confirmation email." });
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
    return response.status(500).json({ message: "We could not subscribe you right now. Please try again." });
  }
}
