import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    "question": "Will I have lifetime access to the course materials and community, or does access expire?",
    "answer": "Yes, you will receive full lifetime access! Once you enroll, you can revisit the course materials, resource libraries, and community spaces whenever you like, allowing you to learn at your own pace."
  },
  {
    "question": "Are the live group sessions recorded if I cannot make the scheduled time?",
    "answer": "Yes, all live sessions are fully recorded. If you have a scheduling conflict or miss a live class, the recordings are uploaded directly to the learning platform shortly after each session so you can easily catch up."
  },
  {
    "question": "How much time do I need to commit each week?",
    "answer": "The course consists of live sessions held every Thursday and Friday, requiring a commitment of 3 hours per session (6 hours total per week)."
  },
  {
    "question": "Is the course fully online or are there in-person components?",
    "answer": "The program is 100% online, allowing you to attend live sessions and access all learning materials comfortably from anywhere."
  },
  {
    "question": "What credentials or certificate do I receive upon completion?",
    "answer": "Upon successfully completing the program, you will receive an official Certificate of Completion to showcase your achievement and new skills."
  },
  {
    "question": "What is the refund policy?",
    "answer": "Please note that all sales are final, and we do not offer refunds once enrollment is confirmed. We encourage you to review the course details thoroughly before registering."
  },
  {
    "question": "Can I pay in installments?",
    "answer": "Yes! In addition to our standard upfront full payment option, we offer flexible installment plans to help break up the cost into manageable payments."
  }
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
            <a href="mailto:trainwithmastersonline@gmail.com" className="text-[#B39255] hover:underline font-medium transition-colors">
              Reach out to our team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}