"use client";

import { useState, useRef, useEffect } from "react";
import { useMenu } from "./menu-context";

const navLinks = [
  { label: "Services", href: "/" },
  { label: "Feedback", href: "/about" },
];

const serviceLinks = [
  { label: "Basic Dazzled Set", href: "/services/basic-gem" },
  { label: "Custom Dazzled Set", href: "/services/custom-design" },
  { label: "Grill Design with Gems", href: "/services/grill-design" },
];

export default function NavBar() {
  const { isOpen, setIsOpen, isServicesOpen, setIsServicesOpen } = useMenu();
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setDesktopServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-transparent fixed inset-x-0 top-0 z-30">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-0">
          {/* Mobile hamburger — hidden on md+ */}
          {!isOpen && (
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center rounded-none p-3 ml-[25px] text-white focus:outline-none focus:ring-0 active:bg-transparent"
            >
              <div className="space-y-1 flex flex-col">
                <span className="block h-0.5 w-6 bg-current transition-all duration-300" />
                <span className="block h-0.5 w-6 bg-current transition-all duration-300" />
                <span className="block h-0.5 w-6 bg-current transition-all duration-300" />
              </div>
            </button>
          )}

          {/* Desktop nav — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1 px-6 h-full">
            {/* Services with dropdown */}
            <div ref={servicesRef} className="relative h-full flex items-center">
              <button
                onClick={() => setDesktopServicesOpen((v) => !v)}
                className="flex items-center gap-1 px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Services
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${desktopServicesOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Services dropdown */}
              {desktopServicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl shadow-lg overflow-hidden">
                  {serviceLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setDesktopServicesOpen(false)}
                      className="block px-4 py-2.5 text-sm text-white hover:bg-white/15 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/about" className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10">
              Feedback
            </a>
            <a href="/contact" className="ml-2 px-4 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-lg border border-white/30 hover:bg-white/10">
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Overlay backdrop — mobile only */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-black/10"
          onClick={() => {
            setIsOpen(false);
            setIsServicesOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      {/* Side slider menu — mobile only */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-20 w-64 bg-white/10 backdrop-blur-md shadow-lg overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        aria-hidden={!isOpen}
      >
        {/* Sliding inner container — shifts left when services open */}
        <div
          className={`flex h-full w-[512px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isServicesOpen ? "-translate-x-64" : "translate-x-0"
            }`}
        >
          {/* Main nav panel */}
          <div className="w-64 flex-shrink-0 flex flex-col px-4 py-6 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-sm text-white hover:bg-white/15"
                  onClick={(e) => {
                    if (link.label === "Services") {
                      e.preventDefault();
                      setIsServicesOpen(true);
                    } else {
                      setIsOpen(false);
                    }
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <a
              href="/contact"
              className="block rounded-xl px-4 py-3 text-sm text-white hover:bg-white/15 border-t border-white/50 pt-4 mt-4"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
          </div>

          {/* Services sub-panel */}
          <div className="w-64 flex-shrink-0 flex flex-col px-4 py-6 overflow-y-auto">
            <button
              onClick={() => setIsServicesOpen(false)}
              className="text-white text-left text-sm mb-4 hover:text-gray-300"
            >
              ← Back
            </button>
            <h2 className="text-white text-lg font-semibold mb-2">Services</h2>
            <div className="flex flex-col">
              {serviceLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-xl py-2.5 text-sm text-white hover:bg-white/15 hover:px-2 transition-all duration-150"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
