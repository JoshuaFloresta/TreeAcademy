import { useEffect, useState } from "react";
import { CircleCheck, FileImage, LoaderCircle, QrCode, Upload, X } from "lucide-react";
import masterclassPoster from "../../assets/images/Masterclass.jpg";

const paymentApiUrl = import.meta.env.VITE_PAYMENT_API_URL || "";
const masterclassName = "Masterclass Intensive Appraisal Copywriting with AI";
const paymentMethods = {
  gotyme: { label: "GoTyme Bank", image: "/gotyme-qr.jpg" },
  bdo: { label: "BDO", image: "/bdo-qr.jpg" },
};

const emptyForm = { fullName: "", contactNumber: "", address: "", email: "" };

export default function Masterclass() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [receipt, setReceipt] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("gotyme");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && setIsOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const onReceiptChange = (event) => {
    const file = event.target.files?.[0];
    setError("");
    if (!file) return setReceipt(null);
    if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      setReceipt(null);
      return setError("Please select a PNG or JPG image no larger than 5MB.");
    }
    setReceipt(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const requiredFields = [["fullName", "Full name"], ["contactNumber", "Contact number"], ["email", "Email address"], ["address", "Address"]];
    const missingField = requiredFields.find(([field]) => !form[field].trim());
    if (missingField) return setError(`${missingField[1]} is required before submitting.`);
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Please enter a valid email address.");
    if (!receipt) return setError("Please upload your proof of payment.");

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      data.append("program", masterclassName);
      data.append("proofOfPayment", receipt);
      const response = await fetch(`${paymentApiUrl}/api/enroll`, { method: "POST", body: data });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Payment service is unavailable. Please try again shortly.");
      setForm(emptyForm);
      setReceipt(null);
      event.target.reset();
      setIsOpen(false);
      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError instanceof TypeError ? "Payment service is unavailable. Please try again shortly." : submissionError.message || "Unable to submit payment details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return <section id="masterclass" className="relative overflow-hidden bg-[#F9F9F7] py-24 md:py-32">
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
    <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
      <div className="overflow-hidden rounded-3xl border border-[#1B432E]/10 bg-white shadow-[0_24px_60px_-30px_rgba(27,67,46,0.45)]">
        <div className="grid items-stretch lg:grid-cols-[.9fr_1.1fr]">
          <div className="flex items-center justify-center bg-white p-5 sm:p-8">
            <img src={masterclassPoster} alt="Intensive Appraisal Copywriting with AI Masterclass advertisement" className="w-full max-w-md rounded-2xl border border-[#1B432E]/10 shadow-xl" />
          </div>
          <div className="flex flex-col p-7 sm:p-10 lg:p-12">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B39255]">Tree Masterclass Series</span>
            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#1B432E] md:text-5xl">Intensive Appraisal Copywriting with AI</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#1B432E]/65">A two-week, standards-based report writing and prompt engineering intensive for real estate appraisers.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-[#B39255]/35 bg-[#B39255]/10 p-4"><p className="text-xs font-semibold uppercase tracking-widest text-[#1B432E]/60">Public rate</p><p className="mt-1 font-serif text-3xl font-bold text-[#1B432E]">₱4,888</p></div><div className="rounded-xl border border-[#1B432E]/10 bg-[#1B432E]/[0.04] p-4"><p className="text-xs font-semibold uppercase tracking-widest text-[#1B432E]/60">Duration</p><p className="mt-1 font-semibold leading-snug text-[#1B432E]">2-week</p></div></div>
            <div className="mt-7"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B39255]">What you will learn</p><ul className="mt-3 grid gap-3 text-sm leading-relaxed text-[#1B432E]/70 sm:grid-cols-2"><li className="rounded-lg border border-[#1B432E]/[0.06] bg-[#1B432E]/[0.04] px-4 py-3">Standards-based AI prompting</li><li className="rounded-lg border border-[#1B432E]/[0.06] bg-[#1B432E]/[0.04] px-4 py-3">Clearer, defensible appraisal writing</li><li className="rounded-lg border border-[#1B432E]/[0.06] bg-[#1B432E]/[0.04] px-4 py-3">Appraisal report case study</li><li className="rounded-lg border border-[#1B432E]/[0.06] bg-[#1B432E]/[0.04] px-4 py-3">AI guidance without losing judgment</li></ul></div>
            <div className="mt-auto pt-8"><button type="button" onClick={() => { setError(""); setIsOpen(true); }} className="w-full rounded-lg bg-[#1B432E] px-6 py-4 font-semibold text-[#F9F9F7] shadow-lg transition hover:bg-[#B39255] sm:w-auto">Join now</button></div>
          </div>
        </div>
      </div>
    </div>

    {isOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10291c]/70 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="masterclass-title" onMouseDown={(event) => event.target === event.currentTarget && setIsOpen(false)}><div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-[#F9F9F7] shadow-2xl"><div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#1B432E]/10 bg-[#F9F9F7] p-5 md:px-8"><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-[#B39255]">Tree Academy Masterclass</p><h2 id="masterclass-title" className="mt-1 font-serif text-2xl font-bold text-[#1B432E] md:text-3xl">Submit your payment confirmation</h2></div><button type="button" onClick={() => setIsOpen(false)} className="rounded p-2 text-[#1B432E] hover:bg-[#1B432E]/10" aria-label="Close masterclass modal"><X className="h-6 w-6" /></button></div><div className="grid gap-8 p-5 md:grid-cols-[.85fr_1.15fr] md:p-8"><div className="h-fit rounded-lg bg-[#1B432E]/[0.04] p-6 text-center"><QrCode className="mx-auto mb-3 h-7 w-7 text-[#B39255]" /><h3 className="font-serif text-xl font-bold text-[#1B432E]">1. Choose a payment QR</h3><p className="mt-2 text-sm text-[#1B432E]/60">Select your bank, complete the payment, and save a screenshot of the successful transaction.</p><div className="mt-4 inline-flex rounded-lg bg-white p-1 shadow-sm" role="group" aria-label="Payment method">{Object.entries(paymentMethods).map(([key, method]) => <button type="button" key={key} onClick={() => setPaymentMethod(key)} className={`rounded-md px-3 py-2 text-sm font-semibold transition ${paymentMethod === key ? "bg-[#1B432E] text-[#F9F9F7]" : "text-[#1B432E]/65 hover:text-[#1B432E]"}`}>{method.label}</button>)}</div><div className="mt-5 rounded-lg bg-white p-2 shadow-sm"><img src={paymentMethods[paymentMethod].image} alt={`${paymentMethods[paymentMethod].label} payment QR code`} className="mx-auto max-h-[350px] w-60 rounded object-contain" /></div></div><form onSubmit={handleSubmit} className="space-y-4" noValidate><div><p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#B39255]">2. Submit your proof</p><h3 className="font-serif text-xl font-bold text-[#1B432E]">Payment confirmation</h3></div>{[["fullName", "Full name", "text", "Your full name"], ["contactNumber", "Contact number", "tel", "09XX XXX XXXX"], ["email", "Email address", "email", "you@example.com"]].map(([field, label, type, placeholder]) => <label key={field} className="block text-sm font-medium text-[#1B432E]">{label}<input required name={field} type={type} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="mt-1.5 w-full rounded border border-[#1B432E]/20 bg-white px-3 py-2.5 outline-none focus:border-[#B39255]" placeholder={placeholder} /></label>)}<label className="block text-sm font-medium text-[#1B432E]">Address<textarea required name="address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className="mt-1.5 min-h-20 w-full rounded border border-[#1B432E]/20 bg-white px-3 py-2.5 outline-none focus:border-[#B39255]" placeholder="House no., street, barangay, city/province" /></label><label className="block text-sm font-medium text-[#1B432E]">Proof of payment<span className="mt-1.5 flex cursor-pointer items-center gap-3 rounded border border-dashed border-[#1B432E]/30 bg-white px-3 py-3 hover:border-[#B39255]"><Upload className="h-5 w-5 text-[#B39255]" /><span className="truncate text-sm text-[#1B432E]/60">{receipt ? receipt.name : "Upload PNG or JPG (max 5MB)"}</span><input required type="file" accept="image/png,image/jpeg" onChange={onReceiptChange} className="sr-only" /></span></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded bg-[#1B432E] px-6 py-3.5 font-semibold text-[#F9F9F7] transition-all hover:bg-[#B39255] disabled:opacity-60">{submitting ? <><LoaderCircle className="h-5 w-5 animate-spin" />Submitting payment details...</> : <><FileImage className="h-5 w-5" />Submit proof of payment</>}</button></form></div></div></div>}
    {submitted && <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#10291c]/70 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="masterclass-success-title"><div className="w-full max-w-md rounded-xl bg-[#F9F9F7] p-7 text-center shadow-2xl"><CircleCheck className="mx-auto h-12 w-12 text-[#B39255]" /><h2 id="masterclass-success-title" className="mt-4 font-serif text-3xl font-bold text-[#1B432E]">Payment submitted</h2><p className="mt-3 text-[#1B432E]/70">Thank you. We will validate your payment and email your Masterclass confirmation.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-6 w-full rounded bg-[#1B432E] px-5 py-3 font-semibold text-[#F9F9F7] transition hover:bg-[#B39255]">Close</button></div></div>}
  </section>;
}
