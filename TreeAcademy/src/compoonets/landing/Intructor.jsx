import React from "react";
import { motion } from "framer-motion";
import instructorProfile from "../../assets/images/instructorProfile.jpg"; // Adjust the path as necessary

const INSTRUCTOR_1 = instructorProfile;

const instructor = {
  image: INSTRUCTOR_1,
  name: "William Floresta",
  title: "Real Estate Broker",
  bio: "A seasoned real estate broker and educator, William Floresta bridges the gap between macroeconomic theory and real-world property markets. With decades of hands-on brokerage experience and a dedicated background in teaching, he specializes in commercial valuation, market analysis, and portfolio theory. William has trained the next generation of industry professionals while successfully managing high-yield property portfolios, making him a trusted authority in both the classroom and the commercial real estate sector.",
  specialties: ["Commercial Valuation", "Market Analysis", "ROI Optimization", "Land Development"],
  stats: [
    {label: "Years Experience", value: "35+" },
   { label: "Students Mentored", value: "500+" },
  ],
};

export default function Instructors() {
  return (
    <section id="instructors" className="py-24 md:py-32 bg-[#1B432E]/[0.03]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[#B39255] font-sans text-sm tracking-[0.25em] uppercase font-medium">
            Your Guide
          </span>
          <h2 className="mt-4 font-serif text-[#1B432E] text-3xl md:text-display-sm font-bold">
            Learn from the Best
          </h2>
          <p className="mt-4 text-[#1B432E]/60 font-sans text-lg max-w-xl mx-auto leading-relaxed">
          "Real market experience. Real-time mentorship."          
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="group flex flex-col md:flex-row gap-10 md:gap-14 items-center"
          >
            {/* Photo */}
            <div className="relative w-64 flex-shrink-0">
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-[#1B432E]/5 shadow-[0_10px_40px_-10px_rgba(27,67,46,0.2)]">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[#1B432E]/0 group-hover:bg-[#1B432E]/10 transition-all duration-500" />
              </div>
              {/* Gold accent border */}
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-[2rem] border-2 border-[#B39255]/30 -z-10" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-5">
              <div>
                <h3 className="font-serif text-[#1B432E] text-3xl md:text-4xl font-bold mb-2">
                  {instructor.name}
                </h3>
                <p className="text-[#B39255] font-sans text-sm font-medium tracking-widest uppercase">
                  {instructor.title}
                </p>
              </div>

              <p className="text-[#1B432E]/65 font-sans text-base leading-relaxed">
                {instructor.bio}
              </p>

              {/* Stats */}
              <div className="flex gap-8 py-4 border-t border-b border-[#1B432E]/[0.08]">
                {instructor.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-serif text-[#B39255] text-2xl font-bold">{stat.value}</p>
                    <p className="text-[#1B432E]/50 font-sans text-xs mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {instructor.specialties.map((s) => (
                  <span
                    key={s}
                    className="px-4 py-1.5 text-xs font-sans font-medium text-[#1B432E] bg-[#B39255]/10 border border-[#B39255]/20 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}