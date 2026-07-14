import React from "react";
import icon from "../../assets/images/icon.png";


const LOGO_URL = icon;

export default function FooterSection() {
  return (
    <footer className="bg-[#1B432E] relative overflow-hidden py-20 md:py-28">
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
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_URL} alt="TREE Logo" className="h-14 w-auto object-contain rounded-lg" />
            </div>
            <p className="text-[#F9F9F7]/40 font-sans text-sm leading-relaxed">
              Cultivating the next generation of real estate leaders through rigorous education and mentorship.
            </p>
          </div>

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

          <div>
            <h4 className="text-[#B39255] font-sans text-xs font-medium tracking-[0.2em] uppercase mb-4">
              Connect
            </h4>
            <div className="space-y-3">
              <a href="mailto:hello@tree-education.com" className="block text-[#F9F9F7]/50 font-sans text-sm hover:text-[#B39255] transition-colors">hello@tree-education.com</a>
              <a href="tel:+18005551234" className="block text-[#F9F9F7]/50 font-sans text-sm hover:text-[#B39255] transition-colors">+1 (800) 555-1234</a>
            </div>
          </div>
        </div>

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
