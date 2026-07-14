import { PDFDocument, rgb } from "pdf-lib";

const PDF_WIDTH = 612;
const PDF_HEIGHT = 792;

// PDF-space coordinates (origin: bottom-left). Each agreement has an independent map.
export const reclexAgreement = {
  file: "/Reclex.pdf", filename: "completed-reclex-commitment-agreement.pdf", pageSize: { width: PDF_WIDTH, height: PDF_HEIGHT },
  fields: [
    { name: "fullName", page: 0, x: 221.2, y: 545, width: 329.6, height: 15, fontSize: 9, label: "Full name" },
    { name: "licenseNumber", page: 0, x: 400, y: 521, width: 144.8, height: 15, fontSize: 9, label: "PRC registration number" },
    { name: "contactNumber", page: 0, x: 221.2, y: 497, width: 86.8, height: 15, fontSize: 9, label: "Contact number" },
    { name: "email", page: 0, x: 364, y: 497, width: 180.8, height: 15, fontSize: 9, label: "Email address" },
    { name: "address", page: 0, x: 221.2, y: 473, width: 329.6, height: 15, fontSize: 9, label: "Address" },
  ],
  signature: { page: 3, x: 326, y: 654, width: 224.8, height: 18 },
  date: { page: 3, x: 358, y: 596, width: 192.8, height: 15, fontSize: 9 },
};

export const reblexRealexAgreement = {
  file: "/Realex&Reblex.pdf", filename: "completed-reblex-realex-commitment-agreement.pdf", pageSize: { width: PDF_WIDTH, height: PDF_HEIGHT },
  fields: [
    { name: "fullName", page: 0, x: 159.2, y: 471, width: 391.6, height: 15, fontSize: 9, label: "Full name" },
    { name: "address", page: 0, x: 159.2, y: 447, width: 391.6, height: 15, fontSize: 9, label: "Address" },
    { name: "contactNumber", page: 0, x: 159.2, y: 423, width: 148.8, height: 15, fontSize: 9, label: "Contact number" },
    { name: "email", page: 0, x: 372, y: 423, width: 172.8, height: 15, fontSize: 9, label: "Email address" },
    { name: "licenseNumber", page: 0, x: 249.2, y: 399, width: 301.6, height: 15, fontSize: 9, label: "PRC application number" },
  ],
  signature: { page: 2, x: 61.2, y: 351, width: 224.8, height: 18 },
  date: { page: 2, x: 93.2, y: 317, width: 192.8, height: 15, fontSize: 9 },
  examCheckboxes: {
    REBLEx: { page: 0, x: 85.2, y: 650, width: 12, height: 12, label: "Select REBLEX" },
    REALEx: { page: 0, x: 85.2, y: 632, width: 12, height: 12, label: "Select REALEX" },
  },
};

const dataUrlToBytes = async (dataUrl) => new Uint8Array(await (await fetch(dataUrl)).arrayBuffer());
const signedDate = () => new Intl.DateTimeFormat("en-PH", { year: "numeric", month: "long", day: "numeric" }).format(new Date());
const drawText = (page, field, value) => value && page.drawText(value, { x: field.x + 2, y: field.y + 3, size: field.fontSize, color: rgb(0, 0, 0), maxWidth: field.width - 4 });

async function loadAgreement(file) {
  const response = await fetch(file);
  if (!response.ok) throw new Error("The agreement PDF could not be loaded.");
  const pdf = await PDFDocument.load(await response.arrayBuffer());
  const form = pdf.getForm();
  if (form.getFields().length) form.flatten();
  return pdf;
}

function saveDownload(bytes, filename) {
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url; link.download = filename; link.click();
  URL.revokeObjectURL(url);
}

export async function downloadReclexAgreement(values, signature) {
  const pdf = await loadAgreement(reclexAgreement.file); const pages = pdf.getPages();
  reclexAgreement.fields.forEach((field) => drawText(pages[field.page], field, values[field.name]?.trim()));
  drawText(pages[reclexAgreement.date.page], reclexAgreement.date, signedDate());
  pages[reclexAgreement.signature.page].drawImage(await pdf.embedPng(await dataUrlToBytes(signature)), reclexAgreement.signature);
  saveDownload(await pdf.save(), reclexAgreement.filename);
}

export async function downloadReblexRealexAgreement(values, signature, programId) {
  const pdf = await loadAgreement(reblexRealexAgreement.file); const pages = pdf.getPages();
  reblexRealexAgreement.fields.forEach((field) => drawText(pages[field.page], field, values[field.name]?.trim()));
  drawText(pages[reblexRealexAgreement.date.page], reblexRealexAgreement.date, signedDate());
  const checkbox = reblexRealexAgreement.examCheckboxes[programId];
  if (checkbox) { const page = pages[checkbox.page]; page.drawLine({ start: { x: checkbox.x + 2, y: checkbox.y + 5 }, end: { x: checkbox.x + 5, y: checkbox.y + 2 }, thickness: 1.5 }); page.drawLine({ start: { x: checkbox.x + 5, y: checkbox.y + 2 }, end: { x: checkbox.x + 10, y: checkbox.y + 10 }, thickness: 1.5 }); }
  pages[reblexRealexAgreement.signature.page].drawImage(await pdf.embedPng(await dataUrlToBytes(signature)), reblexRealexAgreement.signature);
  saveDownload(await pdf.save(), reblexRealexAgreement.filename);
}
