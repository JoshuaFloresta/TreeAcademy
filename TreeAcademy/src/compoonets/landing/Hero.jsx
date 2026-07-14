import React from "react";
import { motion } from "framer-motion";

const HERO_IMG = "https://media.base44.com/images/public/6a549c8d04b7206bb2dea0dd/3fc4534ad_generated_141684dd.png";
const LOGO_URL = "https://media.base44.com/images/public/6a549c8d04b7206bb2dea0dd/ccf658ffb_generated_b061f6c7.png";

export default function Hero({ onEnroll }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="Modern architecture reflecting nature" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B432E]/85 via-[#1B432E]/60 to-[#1B432E]/30" />
      </div>

      {/* Ghost logo */}
      <img
        src={LOGO_URL}
        alt=""
        aria-hidden="true"
        className="absolute right-[-5%] bottom-[-5%] w-[50vw] max-w-[600px] opacity-[0.04] pointer-events-none select-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-32 md:py-40 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
           <span className="inline-block text-[#B39255] font-sans text-sm tracking-[0.25em] uppercase font-medium mb-6">
            Ace the Exam. Secure Your License
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="font-serif text-[#F9F9F7] text-4xl sm:text-5xl md:text-display leading-[1.1] font-bold mb-6"
          >
            Train in Real Estate
            <br />
            <span className="relative inline-block">
              Mastery
              <span className="absolute bottom-1 left-0 w-full h-[2px] bg-[#B39255]" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-[#F9F9F7]/80 font-sans text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
          >
           Your ultimate preparation blueprint. Master every topic in property valuation, brokerage laws, and market analysis with a structured review built to help you pass with confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4"
          >
        <a
          href="#enrollment"
          className="inline-flex items-center justify-center px-8 py-4 bg-[#B39255] text-[#1B432E] font-sans font-semibold text-base tracking-wide rounded shadow-lg hover:shadow-xl hover:bg-[#c9a76a] transition-all duration-300 hover:-translate-y-0.5"
        >
        Begin Your Journey
          </a>
            <a
              href="#curriculum"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#F9F9F7]/30 text-[#F9F9F7] font-sans font-medium text-base tracking-wide rounded hover:border-[#B39255] hover:text-[#B39255] transition-all duration-300"
            >
              View Curriculum
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-14 flex items-center gap-8 text-[#F9F9F7]/60 font-sans text-sm"
          >
            <div className="flex flex-col">
              <span className="text-[#B39255] font-serif text-2xl font-bold">12 weeks</span>
              <span>Duration</span>
            </div>
            <div className="w-px h-8 bg-[#F9F9F7]/20" />
            <div className="flex flex-col">
              <span className="text-[#B39255] font-serif text-2xl font-bold">30+</span>
              <span>Modules</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
