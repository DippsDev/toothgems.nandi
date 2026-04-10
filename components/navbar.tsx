"use client";

import { useMenu } from "./menu-context";

const navLinks = [
  { label: "Services", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
];

const serviceLinks = [
  { label: "Basic gem on tooth", href: "/services/basic-gem" },
  { label: "Cross or Butterfly Set", href: "/services/cross-butterfly" },
  { label: "Grill Design", href: "/services/grill-design" },
  { label: "Custom design", href: "/services/custom-design" },
];

export default function NavBar() {
  const { isOpen, setIsOpen, isServicesOpen, setIsServicesOpen } = useMenu();

  return (
    <nav className="bg-transparent fixed inset-x-0 top-0 z-30">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-0">
          {!isOpen && (
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-none p-3 ml-[25px] text-white focus:outline-none focus:ring-0 active:bg-transparent"
            >
              <div className="space-y-1 flex flex-col">
                <span className="block h-0.5 w-6 bg-current transition-all duration-300" />
                <span className="block h-0.5 w-6 bg-current transition-all duration-300" />
                <span className="block h-0.5 w-6 bg-current transition-all duration-300" />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/10"
          onClick={() => {
            setIsOpen(false);
            setIsServicesOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      {/* Side slider menu */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white/10 backdrop-blur-md shadow-lg overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "translate-x-0" : "-translate-x-full"
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
