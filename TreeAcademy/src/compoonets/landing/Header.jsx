import React, { useState, useEffect } from "react";
import icon from "../../assets/images/icon.png";

const LOGO_URL = icon;

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Instructors", href: "#instructors" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Enroll", href: "#enrollment" },
];

export default function Header({ onEnroll }) {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setAtTop(currentY < 60);
      if (currentY < 60) {
        setVisible(true);
      } else if (currentY > lastScrollY && currentY > 200) {
        setVisible(false);
      } else if (currentY < lastScrollY) {
        setVisible(true);
      }
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${atTop ? "bg-gradient-to-b from-black/30 to-transparent" : "bg-[#F9F9F7]/95 backdrop-blur-md shadow-sm border-b border-[#B39255]/20"}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className={`flex items-center justify-between transition-all duration-300 ${atTop ? "h-20" : "h-16"}`}>
          <a href="#" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="TREE Logo" className={`transition-all duration-300 ${atTop ? "h-14 w-auto" : "h-10 w-auto"} object-contain`} />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => link.label === "Enroll" ? (
              <button key={link.href} type="button" onClick={onEnroll} className={`text-sm font-sans font-medium tracking-wide hover:text-[#B39255] transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-[#B39255] hover:after:w-full after:transition-all after:duration-300 ${atTop ? "text-white" : "text-[#1B432E]"}`}>{link.label}</button>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-sans font-medium tracking-wide hover:text-[#B39255] transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-[#B39255] hover:after:w-full after:transition-all after:duration-300 ${atTop ? "text-white" : "text-[#1B432E]"}`}
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={onEnroll}
              className={`ml-2 px-5 py-2 text-sm font-sans font-medium tracking-wide rounded transition-all duration-300 hover:shadow-lg ${atTop ? "bg-white/20 text-white border border-white/30 hover:bg-[#B39255] hover:border-[#B39255]" : "bg-[#1B432E] text-[#F9F9F7] hover:bg-[#B39255]"}`}
            >
              Start Learning
            </button>
          </nav>

          <button
            className={`md:hidden p-2 transition-colors ${atTop ? "text-white" : "text-[#1B432E]"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#F9F9F7]/98 backdrop-blur-md border-t border-[#B39255]/20 px-6 pb-6 pt-2">
          {navLinks.map((link) => link.label === "Enroll" ? (
            <button key={link.href} type="button" onClick={() => { setMobileOpen(false); onEnroll(); }} className="block w-full py-3 text-left text-[#1B432E] font-sans font-medium text-base border-b border-[#1B432E]/5 hover:text-[#B39255] transition-colors">{link.label}</button>
          ) : (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-[#1B432E] font-sans font-medium text-base border-b border-[#1B432E]/5 hover:text-[#B39255] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => { setMobileOpen(false); onEnroll(); }}
            className="mt-4 block text-center px-5 py-3 bg-[#1B432E] text-[#F9F9F7] font-sans font-medium rounded hover:bg-[#B39255] transition-all"
          >
            Start Learning
          </button>
        </div>
      )}
    </header>
  );
}
