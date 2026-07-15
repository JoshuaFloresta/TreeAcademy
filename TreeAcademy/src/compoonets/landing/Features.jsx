import React from "react";
import { motion } from "framer-motion";

const FEATURE_IMG_1 = "https://media.base44.com/images/public/6a549c8d04b7206bb2dea0dd/cfcb0a038_generated_40bceb17.png";
const FEATURE_IMG_2 = "https://media.base44.com/images/public/6a549c8d04b7206bb2dea0dd/e827ce54d_generated_f0049c19.png";
const FEATURE_IMG_3 = "https://media.base44.com/images/public/6a549c8d04b7206bb2dea0dd/6a0dc8ec4_generated_9c7e7c70.png";
const FEATURE_IMG_4 = "https://media.base44.com/images/public/6a549c8d04b7206bb2dea0dd/de9d98681_generated_95fd016b.png";

const features = [
  {
    image: FEATURE_IMG_1,
    title: "Market Navigation",
    description: "Learn to read market signals, identify emerging neighborhoods, and make data-driven investment decisions with precision.",
  },
  {
    image: FEATURE_IMG_2,
    title: "Contract Mastery",
    description: "Develop expertise in drafting, reviewing, and negotiating contracts that protect your interests and close deals efficiently.",
  },
  {
    image: FEATURE_IMG_3,
    title: "Valuation Science",
    description: "Master the methodologies of property valuation — from comparative analysis to income capitalization and beyond.",
  },
  {
    image: FEATURE_IMG_4,
    title: "Portfolio Strategy",
    description: "Build and manage a diversified real estate portfolio that generates consistent returns and long-term wealth.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[#B39255] font-sans text-sm tracking-[0.25em] uppercase font-medium">
            What You'll Learn
          </span>
          <h2 className="mt-4 font-serif text-[#1B432E] text-3xl md:text-display-sm font-bold">
            Four Pillars of Excellence
          </h2>
          <p className="mt-4 text-[#1B432E]/60 font-sans text-lg max-w-xl mx-auto leading-relaxed text-justify">
            Our curriculum is built on the foundational skills every successful real estate professional must command.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex h-full flex-col"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-6 bg-[#1B432E]/5">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#1B432E]/0 group-hover:bg-[#1B432E]/10 transition-all duration-500" />
              </div>
              <h3 className="font-serif text-[#1B432E] text-xl font-bold mb-2">
                {feature.title}
              </h3>
              <p className="mt-auto text-[#1B432E]/60 font-sans text-sm leading-relaxed text-justify">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
