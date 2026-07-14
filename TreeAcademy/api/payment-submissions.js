import fs from "node:fs/promises";
import path from "node:path";
import multer from "multer";
import nodemailer from "nodemailer";
import { fileTypeFromBuffer } from "file-type";
import { PDFDocument } from "pdf-lib";

const programs = new Set([
  "REALEx - Real Estate Appraiser Review",
  "REBLEx - Real Estate Broker Review",
  "RECLEx - Real Estate Consultant Review",
  "Masterclass Intensive Appraisal Copywriting with AI",
]);
const programCodes = new Map([
  ["REALEx - Real Estate Appraiser Review", "REALEx"],
  ["REBLEx - Real Estate Broker Review", "REBLEx"],
  ["RECLEx - Real Estate Consultant Review", "RECLEx"],
]);
const allowedMimeTypes = new Set(["image/jpeg", "image/png"]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 2 },
  fileFilter: (_request, file, callback) => callback(null, allowedMimeTypes.has(file.mimetype)),
});

export const config = { api: { bodyParser: false } };

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Method not allowed." });
  }

  try {
    await runMiddleware(request, response, upload.fields([
      { name: "proofOfPayment", maxCount: 1 },
      { name: "signature", maxCount: 1 },
    ]));

    const { fullName, contactNumber, address, email, licenseNumber, program } = request.body;
    const receipt = request.files?.proofOfPayment?.[0];
    const signature = request.files?.signature?.[0];
    const requiresAgreement = program !== "Masterclass Intensive Appraisal Copywriting with AI";
    if (!fullName?.trim() || !contactNumber?.trim() || !address?.trim() || !email?.trim() || !/^\S+@\S+\.\S+$/.test(email) || !programs.has(program) || !receipt || (requiresAgreement && !signature)) {
      return response.status(400).json({ message: requiresAgreement ? "Please complete all fields, sign the agreement, and upload a valid receipt." : "Please complete all fields and upload a valid receipt." });
    }

    const [receiptType, signatureType] = await Promise.all([fileTypeFromBuffer(receipt.buffer), signature ? fileTypeFromBuffer(signature.buffer) : null]);
    if (!receiptType || !allowedMimeTypes.has(receiptType.mime) || (requiresAgreement && (!signatureType || !allowedMimeTypes.has(signatureType.mime)))) {
      return response.status(400).json({ message: requiresAgreement ? "Proof of payment and signature must be valid PNG or JPG images." : "Proof of payment must be a valid PNG or JPG image." });
    }
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return response.status(503).json({ message: "Payment email service is not configured yet. Please contact Tree Academy." });
    }

    const name = clean(fullName);
    const contact = clean(contactNumber);
    const customerEmail = clean(email);
    const customerAddress = clean(address, true);
    const license = clean(licenseNumber || "");
    const now = new Date();
    const submittedAt = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(now);
    const agreementDate = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(now);
    const programCode = programCodes.get(program) || "MASTERCLASS";
    const receiptFilename = path.basename(receipt.originalname);
    const agreementFilename = requiresAgreement ? `completed-${programCode}-commitment-agreement.pdf` : null;
    const completedPdf = requiresAgreement ? await createCompletedAgreement({ program, name, contact, customerEmail, customerAddress, license, agreementDate, signature }) : null;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "trainwithmastersonline@gmail.com",
      replyTo: customerEmail,
      subject: `📥 [${programCode}] Payment Submission - ${name}`,
      text: `NEW PAYMENT SUBMISSION\n\nFull Name: ${name}\nContact Number: ${contact}\nEmail Address: ${customerEmail}\nAddress: ${customerAddress}\nProgram: ${program}\nDate Submitted: ${submittedAt}\nProof of Payment: ${receiptFilename}${requiresAgreement ? `\nCompleted Agreement: ${agreementFilename}` : ""}`,
      attachments: [
        { filename: receiptFilename, content: receipt.buffer },
        ...(requiresAgreement ? [{ filename: agreementFilename, content: completedPdf }, { filename: `signed-enrollment-agreement.${signatureType.ext}`, content: signature.buffer }] : []),
      ],
    });

    return response.status(201).json({ message: "Payment details submitted! We will verify your transaction and email your enrollment confirmation shortly." });
  } catch (error) {
    if (error instanceof multer.MulterError) return response.status(400).json({ message: "Upload one PNG or JPG image no larger than 5MB." });
    console.error("Payment submission failed:", error);
    return response.status(500).json({ message: "We could not submit your payment details. Please try again." });
  }
}

function runMiddleware(request, response, middleware) {
  return new Promise((resolve, reject) => middleware(request, response, (error) => error ? reject(error) : resolve()));
}

function clean(value, isAddress = false) {
  return value.trim().replace(isAddress ? /[\r\n]+/g : /[\r\n]/g, isAddress ? ", " : " ");
}

async function createCompletedAgreement({ program, name, contact, customerEmail, customerAddress, license, agreementDate, signature }) {
  const isReclex = program.startsWith("RECLEx");
  const templateName = isReclex ? "Reclex.pdf" : "Realex&Reblex.pdf";
  const document = await PDFDocument.load(await fs.readFile(path.join(process.cwd(), "public", templateName)));
  const form = document.getForm();
  const setText = (field, value) => form.getTextField(field).setText(value);
  const signatureFieldName = isReclex ? "b_signature" : "p_signature";

  if (isReclex) {
    setText("agmt_no", `TREE-${Date.now().toString().slice(-8)}`);
    setText("agmt_date", agreementDate);
    setText("agmt_place", "Online enrollment");
    setText("r_name", name);
    setText("r_lic_type", "Real Estate Consultant");
    setText("r_lic_no", license || "Not provided");
    setText("r_contact", contact);
    setText("r_email", customerEmail);
    setText("r_address", customerAddress);
    setText("r_target_exam", "RECLEX");
    setText("a_date", agreementDate);
    setText("b_signature", "");
    setText("b_date", agreementDate);
  } else {
    setText("p_name", name);
    setText("p_address", customerAddress);
    setText("p_contact", contact);
    setText("p_email", customerEmail);
    setText("p_prc_app", license || "Not provided");
    setText("p_signature", "");
    setText("p_date", agreementDate);
    setText("prov_date", "Pending verification");
    form.getCheckBox(program.startsWith("REBLEx") ? "exam_reblex" : "exam_realex").check();
  }

  const widget = form.getTextField(signatureFieldName).acroField.getWidgets()[0];
  const rectangle = widget.getRectangle();
  const page = document.getPages().find((candidate) => candidate.ref.toString() === widget.P().toString());
  form.flatten();
  const signatureImage = signature.mimetype === "image/jpeg" ? await document.embedJpg(signature.buffer) : await document.embedPng(signature.buffer);
  const scale = Math.min(rectangle.width / signatureImage.width, rectangle.height / signatureImage.height);
  page.drawImage(signatureImage, { x: rectangle.x, y: rectangle.y, width: signatureImage.width * scale, height: signatureImage.height * scale });
  return document.save();
}
