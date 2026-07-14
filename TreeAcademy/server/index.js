import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import multer from "multer";
import nodemailer from "nodemailer";
import { fileTypeFromFile } from "file-type";
import { PDFDocument } from "pdf-lib";
import { subscribeWithResend } from "../lib/newsletter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const programs = new Set([
  "REALEx - Real Estate Appraiser Review",
  "REBLEx - Real Estate Broker Review",
  "RECLEx - Real Estate Consultant Review",
  "Masterclass Intensive Appraisal Copywriting with AI",
]);
const allowedMimeTypes = new Set(["image/jpeg", "image/png"]);
const programCodes = new Map([
  ["REALEx - Real Estate Appraiser Review", "REALEx"],
  ["REBLEx - Real Estate Broker Review", "REBLEx"],
  ["RECLEx - Real Estate Consultant Review", "RECLEx"],
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_request, file, callback) => callback(null, `${crypto.randomUUID()}${file.mimetype === "image/png" ? ".png" : ".jpg"}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 2 },
  fileFilter: (_request, file, callback) => callback(null, allowedMimeTypes.has(file.mimetype)),
});

const app = express();
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: false }));
const clientOrigins = process.env.CLIENT_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean) || ["http://localhost:5173", "http://127.0.0.1:5173"];
app.use(cors({ origin: clientOrigins }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const smtpIsConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

app.post("/api/newsletter", async (request, response, next) => {
  const email = typeof request.body?.email === "string" ? request.body.email.trim() : "";
  if (!/^\S+@\S+\.\S+$/.test(email)) return response.status(400).json({ message: "Please enter a valid email address." });
  try {
    await subscribeWithResend(email);
    return response.status(201).json({ message: "Thank you! Please check your inbox for a confirmation email." });
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
    const status = error.message === "Resend newsletter service is not configured yet." ? 503 : 500;
    return response.status(status).json({ message: error.message || "Newsletter service is unavailable. Please try again shortly." });
  }
});

app.post(["/api/payment-submissions", "/api/enroll"], upload.fields([
  { name: "proofOfPayment", maxCount: 1 },
  { name: "signature", maxCount: 1 },
]), async (request, response, next) => {
  const { fullName, contactNumber, address, email, licenseNumber, program } = request.body;
  const receipt = request.files?.proofOfPayment?.[0];
  const signature = request.files?.signature?.[0];
  const requiresAgreement = program !== "Masterclass Intensive Appraisal Copywriting with AI";
  let completedAgreementPath;

  try {
    if (!smtpIsConfigured) {
      return response.status(503).json({ message: "Payment email service is not configured yet. Please contact Tree Academy." });
    }
    if (!fullName?.trim() || !contactNumber?.trim() || !address?.trim() || !email?.trim() || !/^\S+@\S+\.\S+$/.test(email) || !programs.has(program) || !receipt || (requiresAgreement && !signature)) {
      return response.status(400).json({ message: requiresAgreement ? "Please complete all fields, sign the agreement, and upload a valid receipt." : "Please complete all fields and upload a valid receipt." });
    }

    // Verify the file signature; the browser-supplied MIME type alone is not trusted.
    const uploadedFiles = [receipt, ...(signature ? [signature] : [])];
    const detectedTypes = await Promise.all(uploadedFiles.map((file) => fileTypeFromFile(file.path)));
    if (detectedTypes.some((type) => !type || !allowedMimeTypes.has(type.mime))) {
      uploadedFiles.forEach((file) => fs.existsSync(file.path) && fs.unlinkSync(file.path));
      return response.status(400).json({ message: requiresAgreement ? "Proof of payment and signature must be valid PNG or JPG images." : "Proof of payment must be a valid PNG or JPG image." });
    }

    const name = fullName.trim().replace(/[\r\n]/g, " ");
    const contact = contactNumber.trim().replace(/[\r\n]/g, " ");
    const customerAddress = address.trim().replace(/[\r\n]+/g, ", ");
    const customerEmail = email.trim().replace(/[\r\n]/g, " ");
    const license = (licenseNumber || "").trim().replace(/[\r\n]/g, " ");
    const submittedAt = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date());
    const agreementDate = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(new Date());
    const programCode = programCodes.get(program) || "MASTERCLASS";
    if (requiresAgreement) completedAgreementPath = await createCompletedAgreement({ program, fullName: name, address: customerAddress, contactNumber: contact, email: customerEmail, licenseNumber: license, agreementDate, signaturePath: signature.path });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "trainwithmastersonline@gmail.com",
      replyTo: customerEmail,
      subject: `📥 [${programCode}] Payment Submission - ${name}`,
      text: `=======================================================\nNEW PAYMENT SUBMISSION\n=======================================================\n\nWe have received a new manual payment submission from the website checkout.\nPlease verify this transaction in your bank/e-wallet statement.\n\nCUSTOMER DETAILS:\n-------------------------------------------------------\n👤 Full Name:      ${name}\n📱 Contact No:     ${contact}\n✉️ Email Address:  ${customerEmail}\n📍 Address:        ${customerAddress}\n\nPROGRAM DETAILS:\n-------------------------------------------------------\n📚 Program:        ${program}\n📅 Date Submitted: ${submittedAt} (Asia/Manila)\n\nPROOF OF PAYMENT:\n-------------------------------------------------------\nAttached: proof of payment${requiresAgreement ? " and signed enrollment agreement" : ""}.`,
      html: `<h2>New Payment Submission</h2><p>We have received a new manual payment submission from the website checkout. Please verify this transaction in your bank/e-wallet statement.</p><h3>Customer Details</h3><p><strong>Full Name:</strong> ${escapeHtml(name)}<br><strong>Contact No:</strong> ${escapeHtml(contact)}<br><strong>Email Address:</strong> ${escapeHtml(customerEmail)}<br><strong>Address:</strong> ${escapeHtml(customerAddress)}</p><h3>Program Details</h3><p><strong>Program:</strong> ${escapeHtml(program)}<br><strong>Date Submitted:</strong> ${escapeHtml(submittedAt)} (Asia/Manila)</p><h3>Proof of Payment</h3><p>Attached: proof of payment${requiresAgreement ? " and signed enrollment agreement" : ""}.</p>`,
      attachments: [
        { filename: `proof-of-payment${path.extname(receipt.filename)}`, path: receipt.path },
        ...(requiresAgreement ? [{ filename: `completed-${programCode}-commitment-agreement.pdf`, path: completedAgreementPath }, { filename: `signed-enrollment-agreement${path.extname(signature.filename)}`, path: signature.path }] : []),
      ],
    });

    return response.status(201).json({ message: "Payment details submitted! We will verify your transaction and email your enrollment confirmation shortly." });
  } catch (error) {
    return next(error);
  } finally {
    [receipt?.path, signature?.path, completedAgreementPath].filter(Boolean).forEach((file) => fs.promises.unlink(file).catch(() => {}));
  }
});

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") return response.status(400).json({ message: "Proof of payment must be 5MB or smaller." });
  if (error instanceof multer.MulterError) return response.status(400).json({ message: "Upload one PNG or JPG image." });
  console.error("Payment submission failed:", error);
  return response.status(500).json({ message: "We could not submit your payment details. Please try again." });
});

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

async function createCompletedAgreement({ program, fullName, address, contactNumber, email, licenseNumber, agreementDate, signaturePath }) {
  const isReclex = program.startsWith("RECLEx");
  const templateName = isReclex ? "Reclex.pdf" : "Realex&Reblex.pdf";
  const document = await PDFDocument.load(await fs.promises.readFile(path.join(__dirname, "..", "public", templateName)));
  const form = document.getForm();
  const setText = (fieldName, value) => form.getTextField(fieldName).setText(value);
  const signatureFieldName = isReclex ? "b_signature" : "p_signature";

  if (isReclex) {
    setText("agmt_no", `TREE-${Date.now().toString().slice(-8)}`);
    setText("agmt_date", agreementDate);
    setText("agmt_place", "Online enrollment");
    setText("r_name", fullName);
    setText("r_lic_type", "Real Estate Consultant");
    setText("r_lic_no", licenseNumber || "Not provided");
    setText("r_contact", contactNumber);
    setText("r_email", email);
    setText("r_address", address);
    setText("r_target_exam", "RECLEX");
    setText("a_date", agreementDate);
    setText("b_signature", "");
    setText("b_date", agreementDate);
  } else {
    setText("p_name", fullName);
    setText("p_address", address);
    setText("p_contact", contactNumber);
    setText("p_email", email);
    setText("p_prc_app", licenseNumber || "Not provided");
    setText("p_signature", "");
    setText("p_date", agreementDate);
    setText("prov_date", "Pending verification");
    form.getCheckBox(program.startsWith("REBLEx") ? "exam_reblex" : "exam_realex").check();
  }

  const signatureField = form.getTextField(signatureFieldName);
  const widget = signatureField.acroField.getWidgets()[0];
  const rectangle = widget.getRectangle();
  const page = document.getPages().find((candidate) => candidate.ref.toString() === widget.P().toString());
  form.flatten();
  const signatureImage = await document.embedPng(await fs.promises.readFile(signaturePath));
  const scale = Math.min(rectangle.width / signatureImage.width, rectangle.height / signatureImage.height);
  page.drawImage(signatureImage, { x: rectangle.x, y: rectangle.y, width: signatureImage.width * scale, height: signatureImage.height * scale });
  const completedPath = path.join(uploadDirectory, `${crypto.randomUUID()}-completed-agreement.pdf`);
  await fs.promises.writeFile(completedPath, await document.save());
  return completedPath;
}

app.listen(process.env.PORT || 3001, () => console.log(`Payment API listening on port ${process.env.PORT || 3001}`));
