import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { reviewPrograms } from "../../lib/reviewPrograms";

export default function Syllabus() {
  const [selectedProgram, setSelectedProgram] = useState(reviewPrograms[0]);
  const [openIndex, setOpenIndex] = useState(null);

  const chooseProgram = (program) => {
    setSelectedProgram(program);
    setOpenIndex(null);
  };

  return <section id="curriculum" className="py-24 md:py-32">
    <div className="max-w-4xl mx-auto px-6 md:px-10">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
        <span className="text-[#B39255] font-sans text-sm tracking-[0.25em] uppercase font-medium">The Path</span>
        <h2 className="mt-4 font-serif text-[#1B432E] text-3xl md:text-display-sm font-bold">Review Curriculum</h2>
        <p className="mt-4 text-[#1B432E]/60 font-sans text-lg max-w-xl mx-auto leading-relaxed">Choose a service to explore its dedicated board-exam review curriculum.</p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-3 mb-12" role="tablist" aria-label="Review programs">
        {reviewPrograms.map((program) => <button key={program.id} type="button" role="tab" aria-selected={selectedProgram.id === program.id} onClick={() => chooseProgram(program)} className={`rounded-lg border p-4 text-left transition ${selectedProgram.id === program.id ? "border-[#B39255] bg-[#1B432E] text-[#F9F9F7] shadow-lg" : "border-[#1B432E]/15 text-[#1B432E] hover:border-[#B39255]/60"}`}><span className="font-serif text-xl font-bold">{program.shortName}</span><span className={`block mt-1 text-xs leading-relaxed ${selectedProgram.id === program.id ? "text-[#F9F9F7]/65" : "text-[#1B432E]/55"}`}>{program.name.replace(`${program.shortName} - `, "")}</span></button>)}
      </div>

      <div className="mb-8"><p className="text-[#B39255] font-sans text-xs font-medium tracking-widest uppercase">{selectedProgram.shortName}</p><h3 className="font-serif text-[#1B432E] text-2xl md:text-3xl font-bold mt-1">{selectedProgram.name}</h3><p className="text-[#1B432E]/60 mt-2">{selectedProgram.description}</p></div>
      <div className="relative"><div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#B39255]/20 via-[#B39255]/40 to-[#B39255]/20" />
        {selectedProgram.modules.map((module, index) => {
          const isOpen = openIndex === index;
          return <motion.div key={`${selectedProgram.id}-${module.number}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="relative pl-16 md:pl-20 py-6"><div className={`absolute left-[18px] md:left-[26px] top-8 w-3 h-3 rounded-full border-2 ${isOpen ? "bg-[#B39255] border-[#B39255] scale-125" : "bg-[#F9F9F7] border-[#B39255]/50"}`} /><button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="w-full text-left group"><div className="flex items-start justify-between gap-4"><div><span className="text-[#B39255] text-xs font-medium tracking-widest">{module.weeks}</span><h4 className="font-serif text-[#1B432E] text-xl md:text-2xl font-bold mt-1 group-hover:text-[#B39255] transition-colors"><span className="text-[#B39255]/40 mr-2">{module.number}.</span>{module.title}</h4></div><ChevronDown className={`w-5 h-5 text-[#B39255] mt-6 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} /></div></button><div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 opacity-100 mt-3" : "max-h-0 opacity-0"}`}><p className="text-[#1B432E]/60 text-[15px] leading-relaxed mb-3">{module.description}</p><div className="flex flex-wrap gap-2">{module.topics.map((topic) => <span key={topic} className="px-3 py-1 text-xs font-medium text-[#1B432E]/70 bg-[#1B432E]/[0.05] rounded-full">{topic}</span>)}</div></div>{index < selectedProgram.modules.length - 1 && <div className="border-b border-[#1B432E]/[0.06] mt-6" />}</motion.div>;
        })}
      </div>
    </div>
  </section>;
}
