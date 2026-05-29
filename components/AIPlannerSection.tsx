"use client";

import { useState } from "react";

const EXAMPLE_PROMPTS = [
  "Rooftop venue for 150 guests under $3,000",
  "Elegant wedding ballroom in Manhattan",
  "Corporate retreat with AV for 80 people",
  "Intimate engagement dinner for 40 guests",
] as const;

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12h15m0 0-6.75-6.75M19.5 12l-6.75 6.75"
      />
    </svg>
  );
}

export default function AIPlannerSection() {
  const [prompt, setPrompt] = useState("");

  return (
    <section
      id="ai-planner"
      className="relative overflow-hidden border-t border-neutral-800 bg-neutral-950 py-20 sm:py-24 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#D4AF37]/12 via-transparent to-black"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="animate-fade-in-up mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            <SparkleIcon className="h-4 w-4" />
            Venora AI
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Plan your event with AI
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
            Describe your dream event and Venora will curate venues instantly.
          </p>
        </div>

        <div className="animate-fade-in-up delay-100 mx-auto mt-10 max-w-3xl sm:mt-12">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
            <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/5 ring-1 ring-[#D4AF37]/40">
                <SparkleIcon className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">Event Assistant</p>
                <p className="text-xs text-white/50">
                  Tell us about your occasion, guests, and budget
                </p>
              </div>
            </div>

            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-4 text-sm text-white placeholder:text-white/40 transition-colors duration-200 focus:border-[#D4AF37]/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 sm:px-5 sm:py-4 sm:text-base"
              placeholder="Need a rooftop venue for 150 guests under $3000"
            />

            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/45">
                Try an example
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setPrompt(example)}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-left text-xs text-white/75 transition-all duration-200 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 hover:text-white sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#e0c04a] hover:shadow-lg hover:shadow-[#D4AF37]/25 sm:mt-8 sm:py-4 sm:text-base"
            >
              Generate Recommendations
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>

          <p className="animate-fade-in-up delay-200 mt-6 text-center text-xs text-white/40 sm:text-sm">
            Powered by Venora&apos;s venue intelligence — tailored matches in
            seconds.
          </p>
        </div>
      </div>
    </section>
  );
}
