import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Who is this course designed for?",
    answer: "TREE is built for ambitious professionals at any stage — whether you're entering real estate for the first time, transitioning from a related field like finance or law, or a practicing agent looking to deepen your investment and valuation expertise. Our cohort structure ensures you'll learn alongside peers at a similar level of commitment.",
  },
  {
    question: "How much time do I need to commit each week?",
    answer: "Expect 8–10 hours per week: two live sessions of 90 minutes each, plus case study work, readings, and assignments. The curriculum is dense by design — we respect your time by making every hour count. All live sessions are recorded and available within 24 hours for those in different time zones.",
  },
  {
    question: "Is the course fully online or are there in-person components?",
    answer: "The core curriculum is fully online and accessible globally. However, we host an optional in-person capstone weekend at the end of the 12 weeks for students who can attend. This gathering includes live deal reviews, networking dinners, and a graduation ceremony. Attendance is not required to receive your certificate.",
  },
  {
    question: "What credentials or certificate do I receive upon completion?",
    answer: "Graduates receive a TREE Certificate of Professional Excellence, which is recognized by several state real estate boards for continuing education credits. You'll also receive a detailed skill assessment and a letter of recommendation from your primary instructor upon request.",
  },
  {
    question: "What is the refund policy?",
    answer: "We offer a full 30-day money-back guarantee. If you complete the first two modules and feel the program isn't the right fit, we'll refund 100% of your tuition — no questions asked. Beyond 30 days, we work with students individually on a case-by-case basis.",
  },
  {
    question: "Can I pay in installments?",
    answer: "Yes. We offer a 3-payment plan of $895/month at no additional cost. We also offer need-based scholarships for qualifying applicants. Contact our admissions team to learn more about financial flexibility options.",
  },
  {
    question: "How large are the cohorts?",
    answer: "We cap each cohort at 40 students. This is a deliberate choice — small cohort sizes ensure every student receives direct feedback, meaningful instructor access, and genuine peer relationships. Seats fill quickly; we recommend applying at least 6 weeks before the cohort start date.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#1B432E]/[0.03]">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#B39255] font-sans text-sm tracking-[0.25em] uppercase font-medium">
            Common Questions
          </span>
          <h2 className="mt-4 font-serif text-[#1B432E] text-3xl md:text-display-sm font-bold">
            Frequently Asked
          </h2>
          <p className="mt-4 text-[#1B432E]/60 font-sans text-lg max-w-md mx-auto leading-relaxed">
            Everything you need to know before making your decision.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[#B39255]/40 bg-white shadow-[0_4px_20px_-2px_rgba(179,146,85,0.12)]"
                    : "border-[#1B432E]/[0.07] bg-white/60 hover:border-[#B39255]/25 hover:bg-white"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className={`font-serif text-base md:text-lg font-semibold transition-colors duration-300 ${isOpen ? "text-[#1B432E]" : "text-[#1B432E]/80"}`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen ? "bg-[#B39255] text-white" : "bg-[#1B432E]/[0.05] text-[#1B432E]/40"
                  }`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? "max-h-60" : "max-h-0"}`}>
                  <p className="px-6 pb-6 text-[#1B432E]/60 font-sans text-sm md:text-base leading-[1.75]">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-[#1B432E]/40 font-sans text-sm">
            Still have questions?{" "}
            <a href="mailto:hello@tree-education.com" className="text-[#B39255] hover:underline font-medium transition-colors">
              Reach out to our team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}