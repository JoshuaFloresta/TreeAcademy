import React from "react";
import icon from "../../assets/images/icon.png";


const LOGO_URL = icon;

export default function Footer() {
  return (
    <footer className="bg-[#1B432E] relative overflow-hidden py-20 md:py-28">
      {/* Large watermark logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={LOGO_URL}
          alt=""
          aria-hidden="true"
          className="w-[300px] md:w-[400px] opacity-[0.04]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_URL} alt="TREE Logo" className="h-14 w-auto object-contain rounded-lg" />
            </div>
            <p className="text-[#F9F9F7]/40 font-sans text-sm leading-relaxed">
              Cultivating the next generation of real estate leaders through rigorous education and mentorship.
            </p>
          </div>

          {/* Program */}
          <div>
            <h4 className="text-[#B39255] font-sans text-xs font-medium tracking-[0.2em] uppercase mb-4">
              Program
            </h4>
            <div className="space-y-3">
              <a href="#curriculum" className="block text-[#F9F9F7]/50 font-sans text-sm hover:text-[#B39255] transition-colors">Curriculum</a>
              <a href="#instructors" className="block text-[#F9F9F7]/50 font-sans text-sm hover:text-[#B39255] transition-colors">Instructors</a>
              <a href="#enrollment" className="block text-[#F9F9F7]/50 font-sans text-sm hover:text-[#B39255] transition-colors">Enrollment</a>
              <a href="#testimonials" className="block text-[#F9F9F7]/50 font-sans text-sm hover:text-[#B39255] transition-colors">Testimonials</a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[#B39255] font-sans text-xs font-medium tracking-[0.2em] uppercase mb-4">
              Resources
            </h4>
            <div className="space-y-3">
              <a href="#features" className="block text-[#F9F9F7]/50 font-sans text-sm hover:text-[#B39255] transition-colors">Free Guide</a>
              <a href="#features" className="block text-[#F9F9F7]/50 font-sans text-sm hover:text-[#B39255] transition-colors">Blog</a>
              <a href="#features" className="block text-[#F9F9F7]/50 font-sans text-sm hover:text-[#B39255] transition-colors">Market Reports</a>
              <a href="#features" className="block text-[#F9F9F7]/50 font-sans text-sm hover:text-[#B39255] transition-colors">Webinars</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#B39255] font-sans text-xs font-medium tracking-[0.2em] uppercase mb-4">
              Connect
            </h4>
            <div className="space-y-3">
              <a href="mailto:hello@tree-education.com" className="block text-[#F9F9F7]/50 font-sans text-sm hover:text-[#B39255] transition-colors">hello@tree-education.com</a>
              <a href="tel:+18005551234" className="block text-[#F9F9F7]/50 font-sans text-sm hover:text-[#B39255] transition-colors">+1 (800) 555-1234</a>
            </div>
            <div className="flex gap-4 mt-6">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#F9F9F7]/30 hover:text-[#B39255] transition-colors" aria-label="LinkedIn">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#F9F9F7]/30 hover:text-[#B39255] transition-colors" aria-label="Instagram">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-[#F9F9F7]/30 hover:text-[#B39255] transition-colors" aria-label="X">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom border with tagline */}
        <div className="border-t border-[#F9F9F7]/[0.08] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#F9F9F7]/25 font-sans text-xs">
            © 2026 TREE. All rights reserved.
          </p>
          <p className="text-[#B39255]/40 font-sans text-[10px] tracking-[0.35em] uppercase font-medium">
            Training for Real Estate Excellence
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[#F9F9F7]/25 font-sans text-xs hover:text-[#B39255] transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#F9F9F7]/25 font-sans text-xs hover:text-[#B39255] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}