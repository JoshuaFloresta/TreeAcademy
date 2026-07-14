import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

const newsletterApiUrl = import.meta.env.VITE_PAYMENT_API_URL || "";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subscribe = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Please enter a valid email address.");
    setSubmitting(true);
    try {
      const response = await fetch(`${newsletterApiUrl}/api/newsletter`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim() }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to subscribe right now. Please try again.");
      setSubscribed(true);
    } catch (subscriptionError) {
      setError(subscriptionError instanceof TypeError ? "Newsletter service is unavailable. Please try again shortly." : subscriptionError.message || "Unable to subscribe right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return <section id="newsletter" className="bg-[#F9F9F7] px-6 pb-24 md:px-10 md:pb-32">
    <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#1B432E] px-7 py-10 shadow-[0_24px_60px_-30px_rgba(27,67,46,0.65)] sm:px-10 md:grid md:grid-cols-[1fr_.9fr] md:items-center md:gap-12 md:px-14 md:py-14">
      <div><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#B39255]/20 text-[#B39255]"><Mail className="h-5 w-5" /></div><span className="mt-5 block text-xs font-semibold uppercase tracking-[0.25em] text-[#B39255]">Stay connected</span><h2 className="mt-3 font-serif text-3xl font-bold text-[#F9F9F7] md:text-4xl">Get insights that move your career forward.</h2><p className="mt-4 max-w-xl leading-relaxed text-[#F9F9F7]/65">Receive updates on new review programs, masterclasses, and practical real estate learning resources.</p></div>
      <form onSubmit={subscribe} className="mt-8 md:mt-0" noValidate>{subscribed ? <p role="status" className="rounded-xl bg-white/10 px-5 py-4 text-center font-medium text-[#F9F9F7]">You’re on the list. Please check your inbox.</p> : <><label className="sr-only" htmlFor="newsletter-email">Email address</label><div className="flex flex-col gap-3 sm:flex-row"><input id="newsletter-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email address" className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white px-4 py-3.5 text-[#1B432E] outline-none placeholder:text-[#1B432E]/45 focus:border-[#B39255]" /><button disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B39255] px-5 py-3.5 font-semibold text-[#1B432E] transition hover:bg-[#F9F9F7] disabled:opacity-60">{submitting ? "Subscribing..." : <>Subscribe <ArrowRight className="h-4 w-4" /></>}</button></div>{error && <p role="alert" className="mt-3 text-sm text-red-200">{error}</p>}<p className="mt-3 text-xs text-[#F9F9F7]/45">No spam—only relevant training updates.</p></>}</form>
    </div>
  </section>;
}
