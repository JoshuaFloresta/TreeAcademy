import { useEffect, useRef, useState } from "react";
import { Check, CircleCheck, FileImage, LoaderCircle, QrCode, ScrollText, Upload, X } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { programNames, reviewPrograms } from "../../lib/reviewPrograms";
import { downloadReblexRealexAgreement, downloadReclexAgreement, reblexRealexAgreement, reclexAgreement } from "../../lib/agreementPdfs";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

// During local development, Vite proxies /api to the Express server. Set this
// variable only when the API is hosted on a different production domain.
const paymentApiUrl = import.meta.env.VITE_PAYMENT_API_URL || "";
const paymentMethods = {
  gotyme: { label: "GoTyme Bank", image: "/gotyme-qr.jpg" },
  bdo: { label: "BDO", image: "/bdo-qr.jpg" },
};

export default function Enrollment({ isOpen, onOpen, onClose }) {
  const [form, setForm] = useState({ fullName: "", contactNumber: "", address: "", email: "", licenseNumber: "", program: programNames[0] });
  const [receipt, setReceipt] = useState(null);
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState("contract");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("gotyme");
  const selectedProgram = reviewPrograms.find((program) => program.name === form.program) || reviewPrograms[0];

  useEffect(() => {
    if (!isOpen) return undefined;
    setStep("contract");
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown); };
  }, [isOpen, onClose]);

  const openProgram = (program) => {
    setForm((current) => ({ ...current, program: program.name }));
    setSignature(""); setAgreed(false); setError(""); setSuccess(""); onOpen();
  };

  const onReceiptChange = (event) => {
    const file = event.target.files?.[0];
    setError("");
    if (!file) return setReceipt(null);
    if (!["image/png", "image/jpeg"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      event.target.value = ""; setReceipt(null);
      return setError("Please select a PNG or JPG image no larger than 5MB.");
    }
    setReceipt(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); setSuccess("");
    const requiredFields = [["fullName", "Full name"], ["contactNumber", "Contact number"], ["email", "Email address"], ["address", "Address"]];
    const missingField = requiredFields.find(([field]) => !form[field].trim());
    if (missingField) return setError(`${missingField[1]} is required before we can create your signed agreement.`);
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Please enter a valid email address.");
    if (!receipt) return setError("Please upload your proof of payment.");
    if (!signature || !agreed) return setError("Please sign and accept the commitment agreement before submitting.");
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      data.append("proofOfPayment", receipt);
      const signatureBlob = await (await fetch(signature)).blob();
      data.append("signature", signatureBlob, "signed-enrollment-agreement.png");
      const response = await fetch(`${paymentApiUrl}/api/enroll`, { method: "POST", body: data });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Payment service is unavailable. Please try again shortly.");
      setSuccess(result.message); setShowSubmissionSuccess(true); setReceipt(null); setSignature(""); setAgreed(false);
      setForm({ fullName: "", contactNumber: "", address: "", email: "", licenseNumber: "", program: programNames[0] }); event.target.reset();
    } catch (submissionError) {
      const message = submissionError instanceof TypeError
        ? "Payment service is unavailable. Please try again shortly."
        : submissionError.message || "Unable to submit payment details. Please try again.";
      setError(message);
    }
    finally { setSubmitting(false); }
  };

  const continueToPayment = () => {
    setError("");
    const requiredFields = [["fullName", "Full name"], ["contactNumber", "Contact number"], ["email", "Email address"], ["address", "Address"]];
    const missingField = requiredFields.find(([field]) => !form[field].trim());
    if (missingField) return setError(`${missingField[1]} is required before you can continue to payment.`);
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Please enter a valid email address before continuing.");
    if (!signature) return setError("Please draw your signature before continuing to payment.");
    setAgreed(true);
    setStep("payment");
  };

  const returnToHero = () => {
    setShowSubmissionSuccess(false);
    onClose();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <section id="enrollment" className="py-24 md:py-32 bg-[#1B432E] relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
    <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-10">
      <div className="max-w-2xl"><span className="text-[#B39255] text-sm tracking-[0.25em] uppercase font-medium">Take the first step today</span><h2 className="mt-4 font-serif text-[#F9F9F7] text-3xl md:text-5xl font-bold">Choose your review program.</h2><p className="mt-4 text-[#F9F9F7]/60 text-lg">Review the curriculum, commitment agreement, and payment instructions before enrolling.</p></div>
      <div className="grid md:grid-cols-3 gap-5 mt-10">{reviewPrograms.map((program) => <article key={program.id} className="group relative overflow-hidden rounded-xl bg-[#F9F9F7] p-6 shadow-xl flex flex-col text-left border border-white/20 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"><div className="absolute inset-x-0 top-0 h-1 bg-[#B39255]" /><div className="flex items-start justify-between gap-3"><span className="text-[#B39255] text-xs font-semibold tracking-[0.2em] uppercase">Licensure review</span><span className="rounded-full bg-[#1B432E]/[0.06] px-2.5 py-1 text-xs font-bold text-[#1B432E]">12 weeks</span></div><h3 className="mt-5 font-serif text-3xl font-bold text-[#1B432E]">{program.shortName}</h3><p className="mt-2 min-h-[168px] text-sm leading-relaxed text-[#1B432E]/60">{program.description}</p><ul className="mt-5 space-y-2 border-y border-[#1B432E]/10 py-4 text-sm text-[#1B432E]/70">{program.perks.map((perk) => <li key={perk} className="flex gap-2"><Check className="w-4 h-4 mt-0.5 text-[#B39255]" />{perk}</li>)}</ul><div className="mt-auto pt-5"><p className="font-serif text-3xl font-bold text-[#1B432E]">{program.price}</p><p className="mt-1 text-sm text-[#1B432E]/55">{program.upfrontFee}</p></div><button type="button" onClick={() => openProgram(program)} className="mt-6 w-full rounded bg-[#1B432E] px-5 py-3 font-semibold text-[#F9F9F7] group-hover:bg-[#B39255] transition">Review agreement & enroll</button></article>)}</div>
    </div>

    {isOpen && <div className="fixed inset-0 z-[100] bg-[#10291c]/70 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="enrollment-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-xl bg-[#F9F9F7] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-5 md:px-8 border-b border-[#1B432E]/10 bg-[#F9F9F7]"><div><p className="text-[#B39255] text-xs font-medium tracking-[0.2em] uppercase">Tree Academy Enrollment</p><h2 id="enrollment-title" className="font-serif text-[#1B432E] text-2xl md:text-3xl font-bold mt-1">{step === "contract" ? "Review and sign your agreement" : "Submit your payment details"}</h2></div><button type="button" onClick={onClose} className="p-2 rounded hover:bg-[#1B432E]/10 text-[#1B432E]" aria-label="Close enrollment modal"><X className="w-6 h-6" /></button></div>
        <div className="p-5 md:p-8">{step === "contract" ? <ContractReview program={selectedProgram} form={form} onFormChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))} signature={signature} onSignature={setSignature} error={error} onContinue={continueToPayment} /> : <><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg bg-[#1B432E]/[0.04] p-4 mb-8"><div><p className="text-xs uppercase tracking-widest text-[#B39255] font-semibold">Selected program</p><h3 className="font-serif font-bold text-[#1B432E] text-xl mt-1">{selectedProgram.name}</h3><p className="text-sm text-[#1B432E]/60 mt-1">{selectedProgram.price} · {selectedProgram.upfrontFee}</p></div><button type="button" onClick={() => setStep("contract")} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#1B432E] hover:text-[#B39255]"><ScrollText className="w-4 h-4" />Review signed agreement</button></div>
          <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-8 border-t border-[#1B432E]/10 pt-8"><div className="rounded-lg bg-[#1B432E]/[0.04] p-6 text-center h-fit"><QrCode className="w-7 h-7 text-[#B39255] mx-auto mb-3" /><h3 className="font-serif text-xl font-bold text-[#1B432E]">1. Choose a payment QR</h3><p className="text-sm text-[#1B432E]/60 mt-2">Select your preferred bank, pay the required amount, then save a screenshot of the successful payment.</p><div className="mt-4 inline-flex rounded-lg bg-white p-1 shadow-sm" role="group" aria-label="Payment method">{Object.entries(paymentMethods).map(([key, method]) => <button type="button" key={key} onClick={() => setPaymentMethod(key)} className={`rounded-md px-3 py-2 text-sm font-semibold transition ${paymentMethod === key ? "bg-[#1B432E] text-[#F9F9F7]" : "text-[#1B432E]/65 hover:text-[#1B432E]"}`}>{method.label}</button>)}</div><div className="mt-5 rounded-lg bg-white p-2 shadow-sm"><img src={paymentMethods[paymentMethod].image} alt={`${paymentMethods[paymentMethod].label} payment QR code`} className="w-60 max-h-[350px] object-contain mx-auto rounded" /></div><p className="mt-3 text-xs leading-relaxed text-[#1B432E]/60">{paymentMethods[paymentMethod].note}</p></div>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate><div><p className="text-[#B39255] text-xs font-medium tracking-[0.2em] uppercase mb-2">2. Submit your proof</p><h3 className="font-serif text-xl font-bold text-[#1B432E]">Payment confirmation</h3></div><label className="block text-sm font-medium text-[#1B432E]">Full name<input required name="fullName" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className="mt-1.5 w-full rounded border border-[#1B432E]/20 bg-white px-3 py-2.5 outline-none focus:border-[#B39255]" placeholder="Your full name" /></label><label className="block text-sm font-medium text-[#1B432E]">Contact number<input required name="contactNumber" type="tel" value={form.contactNumber} onChange={(event) => setForm({ ...form, contactNumber: event.target.value })} className="mt-1.5 w-full rounded border border-[#1B432E]/20 bg-white px-3 py-2.5 outline-none focus:border-[#B39255]" placeholder="09XX XXX XXXX" /></label><label className="block text-sm font-medium text-[#1B432E]">Email address<input required name="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1.5 w-full rounded border border-[#1B432E]/20 bg-white px-3 py-2.5 outline-none focus:border-[#B39255]" placeholder="you@example.com" /></label><label className="block text-sm font-medium text-[#1B432E]">Address<textarea required name="address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className="mt-1.5 min-h-20 w-full rounded border border-[#1B432E]/20 bg-white px-3 py-2.5 outline-none focus:border-[#B39255]" placeholder="House no., street, barangay, city/province" /></label><input type="hidden" name="program" value={form.program} /><label className="block text-sm font-medium text-[#1B432E]">Proof of payment<span className="mt-1.5 flex items-center gap-3 rounded border border-dashed border-[#1B432E]/30 bg-white px-3 py-3 cursor-pointer hover:border-[#B39255]"><Upload className="w-5 h-5 text-[#B39255]" /><span className="text-sm text-[#1B432E]/60 truncate">{receipt ? receipt.name : "Upload PNG or JPG (max 5MB)"}</span><input required type="file" accept="image/png,image/jpeg" onChange={onReceiptChange} className="sr-only" /></span></label><label className="flex items-start gap-3 rounded bg-[#1B432E]/[0.04] p-3 text-sm text-[#1B432E]/75"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 accent-[#1B432E]" /><span>I confirm that this is my electronic signature and I accept the commitment agreement.</span></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}{success && <p role="status" className="flex gap-2 text-sm text-[#1B432E]"><CircleCheck className="w-5 h-5 text-[#B39255] shrink-0" />{success}</p>}<button disabled={submitting} className="w-full px-6 py-3.5 bg-[#1B432E] disabled:opacity-60 text-[#F9F9F7] font-semibold rounded hover:bg-[#B39255] transition-all flex justify-center items-center gap-2">{submitting ? <><LoaderCircle className="w-5 h-5 animate-spin" />Submitting payment details...</> : <><FileImage className="w-5 h-5" />Submit proof of payment</>}</button></form>
          </div></>}</div>
      </div>
    </div>}
    {showSubmissionSuccess && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#10291c]/70 backdrop-blur-sm p-5" role="dialog" aria-modal="true" aria-labelledby="submission-success-title"><div className="w-full max-w-md rounded-xl bg-[#F9F9F7] p-7 text-center shadow-2xl"><CircleCheck className="mx-auto h-12 w-12 text-[#B39255]" /><h2 id="submission-success-title" className="mt-4 font-serif text-3xl font-bold text-[#1B432E]">Payment submitted</h2><p className="mt-3 text-[#1B432E]/70">Thank you. Please wait while we validate your payment. We will contact you once your enrollment has been confirmed.</p><button type="button" onClick={returnToHero} className="mt-6 w-full rounded bg-[#1B432E] px-5 py-3 font-semibold text-[#F9F9F7] hover:bg-[#B39255] transition">Return to home page</button></div></div>}
  </section>;
}

function ContractReview({ program, form, onFormChange, signature, onSignature, error, onContinue }) {
  const inputClassName = "mt-1.5 w-full rounded border border-[#1B432E]/20 bg-white px-3 py-2.5 outline-none focus:border-[#B39255]";
  const updateField = (event) => onFormChange(event.target.name, event.target.value);
  const agreement = program.id === "RECLEx" ? reclexAgreement : reblexRealexAgreement;
  const download = async () => {
    if (program.id === "RECLEx") await downloadReclexAgreement(form, signature);
    else await downloadReblexRealexAgreement(form, signature, program.id);
  };

  return <div className="max-w-4xl mx-auto">
    <div className="rounded-lg bg-[#1B432E] p-6 md:p-8 text-[#F9F9F7]">
      <p className="text-[#B39255] text-xs font-semibold tracking-[0.2em] uppercase">Step 1 of 2 · review before payment</p>
      <h3 className="font-serif text-3xl font-bold mt-2">{program.name}</h3>
      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-[#F9F9F7]/70"><span>Program fee: <strong className="text-white">{program.price}</strong></span><span>Initial payment: <strong className="text-white">{program.upfrontFee}</strong></span></div>
    </div>
    <article className="mt-6 rounded-lg border border-[#1B432E]/10 p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-4"><div className="flex items-center gap-2 text-[#B39255]"><ScrollText className="w-5 h-5" /><span className="text-xs font-semibold tracking-[0.2em] uppercase">Commitment agreement</span></div><a href={program.contractPdf} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#1B432E] underline hover:text-[#B39255]">Open PDF</a></div>
      <AgreementPdfViewer agreement={agreement} programId={program.id} form={form} onFormChange={onFormChange} signature={signature} />
    </article>
    <section className="hidden">
      <h4 className="font-serif text-xl font-bold text-[#1B432E]">Agreement details</h4>
      <p className="mt-1 text-sm text-[#1B432E]/65">Complete these required fields. They will be entered into your signed PDF agreement.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[#1B432E]">Full name<input required name="fullName" value={form.fullName} onChange={updateField} className={inputClassName} /></label>
        <label className="block text-sm font-medium text-[#1B432E]">Contact number<input required name="contactNumber" type="tel" value={form.contactNumber} onChange={updateField} className={inputClassName} /></label>
        <label className="block text-sm font-medium text-[#1B432E]">Email address<input required name="email" type="email" value={form.email} onChange={updateField} className={inputClassName} /></label>
        <label className="block text-sm font-medium text-[#1B432E]">PRC application / license number <span className="font-normal text-[#1B432E]/55">(optional)</span><input name="licenseNumber" value={form.licenseNumber} onChange={updateField} className={inputClassName} /></label>
        <label className="block text-sm font-medium text-[#1B432E] sm:col-span-2">Address<textarea required name="address" value={form.address} onChange={updateField} className={`${inputClassName} min-h-20`} /></label>
      </div>
    </section>
    <div className="mt-6 rounded-lg border border-[#B39255]/50 bg-[#B39255]/[0.06] p-5"><h4 className="font-serif text-xl font-bold text-[#1B432E]">Sign the agreement</h4><p className="mt-1 text-sm text-[#1B432E]/65">Draw your signature below. It will be embedded in the completed agreement PDF.</p><SignaturePad value={signature} onChange={onSignature} /></div>
    {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
    <div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" disabled={!signature} onClick={download} className="rounded border border-[#1B432E] disabled:opacity-50 px-6 py-4 font-semibold text-[#1B432E] hover:bg-[#1B432E]/5 transition">Download completed PDF</button><button type="button" disabled={!signature} onClick={onContinue} className="rounded bg-[#1B432E] disabled:opacity-50 px-6 py-4 font-semibold text-[#F9F9F7] hover:bg-[#B39255] transition">Continue to Payment</button></div>
  </div>;
}

function AgreementPdfViewer({ agreement, programId, form, onFormChange, signature }) {
  const viewerRef = useRef(null);
  const [width, setWidth] = useState(612);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    const resize = () => setWidth(Math.max(320, Math.min(760, viewerRef.current?.clientWidth || 612)));
    resize();
    const observer = new ResizeObserver(resize);
    if (viewerRef.current) observer.observe(viewerRef.current);
    return () => observer.disconnect();
  }, []);

  const overlayStyle = (field) => ({
    left: `${(field.x / agreement.pageSize.width) * 100}%`,
    top: `${((agreement.pageSize.height - field.y - field.height) / agreement.pageSize.height) * 100}%`,
    width: `${(field.width / agreement.pageSize.width) * 100}%`,
    height: `${(field.height / agreement.pageSize.height) * 100}%`,
  });

  return <div ref={viewerRef} className="max-h-[62vh] overflow-auto rounded border border-[#1B432E]/10 bg-[#1B432E]/[0.03] p-2">
    <Document file={agreement.file} onLoadSuccess={({ numPages }) => setPages(numPages)} loading={<p className="p-4 text-sm text-[#1B432E]/70">Loading agreement…</p>} error={<p className="p-4 text-sm text-red-700">Unable to display this agreement PDF.</p>}>
      {Array.from({ length: pages }, (_, page) => <div key={page} className="relative mx-auto mb-3 last:mb-0" style={{ width }}>
        <Page pageNumber={page + 1} width={width} renderTextLayer={false} renderAnnotationLayer={false} />
        <div className="absolute inset-0 z-10">
          {agreement.fields.filter((field) => field.page === page).map((field) => <input key={field.name} aria-label={field.label} name={field.name} value={form[field.name]} onChange={(event) => onFormChange(field.name, event.target.value)} style={overlayStyle(field)} className="absolute border border-[#B39255]/70 bg-white/75 px-1 text-[9px] leading-none text-[#1B432E] outline-none focus:bg-white focus:ring-1 focus:ring-[#B39255]" />)}
          {Object.entries(agreement.examCheckboxes || {}).filter(([, checkbox]) => checkbox.page === page).map(([examId, checkbox]) => <button key={examId} type="button" aria-label={checkbox.label} aria-pressed={programId === examId} onClick={() => { const selected = reviewPrograms.find((item) => item.id === examId); if (selected) onFormChange("program", selected.name); }} style={overlayStyle(checkbox)} className={`absolute flex items-center justify-center border border-[#B39255]/70 bg-white/75 text-[12px] leading-none text-[#1B432E] outline-none focus:ring-1 focus:ring-[#B39255] ${programId === examId ? "font-bold" : ""}`}>{programId === examId ? "✓" : ""}</button>)}
          {agreement.signature.page === page && signature && <img src={signature} alt="Drawn signature" style={overlayStyle(agreement.signature)} className="absolute object-contain pointer-events-none" />}
        </div>
      </div>)}
    </Document>
  </div>;
}

function SignaturePad({ value, onChange }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const pointForEvent = (event) => { const rect = canvasRef.current.getBoundingClientRect(); return { x: (event.clientX - rect.left) * (canvasRef.current.width / rect.width), y: (event.clientY - rect.top) * (canvasRef.current.height / rect.height) }; };
  const start = (event) => { drawingRef.current = true; lastPointRef.current = pointForEvent(event); canvasRef.current.setPointerCapture(event.pointerId); };
  const draw = (event) => { if (!drawingRef.current) return; const canvas = canvasRef.current; const context = canvas.getContext("2d"); const point = pointForEvent(event); context.strokeStyle = "#1B432E"; context.lineWidth = 3; context.lineCap = "round"; context.beginPath(); context.moveTo(lastPointRef.current.x, lastPointRef.current.y); context.lineTo(point.x, point.y); context.stroke(); lastPointRef.current = point; };
  const finish = () => { if (!drawingRef.current) return; drawingRef.current = false; onChange(canvasRef.current.toDataURL("image/png")); };
  const clear = () => { const canvas = canvasRef.current; canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height); onChange(""); };
  return <div className="mt-4"><canvas ref={canvasRef} width="720" height="220" onPointerDown={start} onPointerMove={draw} onPointerUp={finish} onPointerCancel={finish} className="w-full h-40 rounded border border-dashed border-[#1B432E]/30 bg-white touch-none cursor-crosshair" aria-label="Signature pad" /><div className="mt-2 flex items-center justify-between gap-3"><span className="text-xs text-[#1B432E]/55">{value ? "Signature captured" : "Use your mouse or finger to sign"}</span><button type="button" onClick={clear} className="text-sm font-semibold text-[#1B432E] underline hover:text-[#B39255]">Clear signature</button></div></div>;
}
