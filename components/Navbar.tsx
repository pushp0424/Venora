"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const navLinks = [
  { label: "Explore", href: "#venues" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For hosts", href: "/become-a-host" },
] as const;

const SCROLL_THRESHOLD = 32;

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      {open ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      )}
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const overHero = isHome && !scrolled && !menuOpen;

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkClass = overHero
    ? "text-sm text-white/80 transition-colors duration-200 hover:text-[#D4AF37]"
    : "text-sm text-neutral-600 transition-colors duration-200 hover:text-[#D4AF37]";

  const signInClass = overHero
    ? "rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-[#D4AF37]"
    : "rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-100 hover:text-[#D4AF37]";

  const listVenueClass = overHero
    ? "rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-medium text-black transition-all duration-200 hover:bg-[#e0c04a] hover:shadow-lg hover:shadow-[#D4AF37]/25"
    : "rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 hover:shadow-lg";

  const menuButtonClass = overHero
    ? "rounded-lg p-2 text-white transition-colors duration-200 hover:bg-white/10 hover:text-[#D4AF37]"
    : "rounded-lg p-2 text-neutral-900 transition-colors duration-200 hover:bg-neutral-100 hover:text-[#D4AF37]";

  const logoTextClass = overHero
    ? "text-xl font-semibold tracking-tight text-white transition-colors duration-200 group-hover:text-[#D4AF37]"
    : "text-xl font-semibold tracking-tight text-neutral-900 transition-colors duration-200 group-hover:text-[#D4AF37]";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out ${
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-neutral-200/60 bg-white/85 shadow-sm shadow-black/5 backdrop-blur-xl"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-[4.5rem] lg:px-8">
        <a href="#" className="group flex items-center gap-2.5">
          <Image
            src="/WhatsApp Image 2026-05-28 at 10.12.08 PM.jpeg"
            alt="Venora Logo"
            width={38}
            height={38}
            className={`rounded-full transition-all duration-300 ${
              overHero ? "ring-2 ring-white/20" : "ring-1 ring-neutral-200"
            }`}
          />
          <span className={logoTextClass}>Venora</span>
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className={linkClass}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a href="/sign-in" className={signInClass}>
            Sign in
          </a>
          <a href="#venues" className={listVenueClass}>
            List your venue
          </a>
        </div>

        <button
          type="button"
          className={`relative z-50 md:hidden ${menuButtonClass}`}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <MenuIcon open={menuOpen} />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 top-16 z-40 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="absolute inset-x-0 top-full z-40 border-b border-neutral-800/50 bg-neutral-950/95 shadow-2xl backdrop-blur-xl md:hidden"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mx-auto max-w-7xl px-4 py-5">
                <ul className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.label}
                      initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: prefersReducedMotion ? 0 : 0.05 * index,
                        duration: 0.25,
                      }}
                    >
                      <a
                        href={link.href}
                        className="block rounded-xl px-4 py-3.5 text-base font-medium text-white/90 transition-colors duration-200 hover:bg-white/5 hover:text-[#D4AF37]"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

                <motion.div
                  className="space-y-2"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : 0.15,
                    duration: 0.25,
                  }}
                >
                  <a
                    href="/sign-in"
                    className="block rounded-xl px-4 py-3.5 text-base font-medium text-white/80 transition-colors duration-200 hover:bg-white/5 hover:text-[#D4AF37]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign in
                  </a>
                  <a
                    href="#venues"
                    className="block rounded-xl bg-[#D4AF37] px-4 py-3.5 text-center text-base font-semibold text-black transition-all duration-200 hover:bg-[#e0c04a]"
                    onClick={() => setMenuOpen(false)}
                  >
                    List your venue
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
