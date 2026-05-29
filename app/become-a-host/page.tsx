import type { Metadata } from "next";
import HostRegistrationForm from "@/components/host/HostRegistrationForm";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Become a Host — Venora",
  description:
    "Apply to list your premium event venue on Venora and reach qualified planners worldwide.",
};

export default function BecomeAHostPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <main className="pt-16 lg:pt-[4.5rem]">
        <header className="border-b border-neutral-100 bg-neutral-950 text-white">
          <div className="relative mx-auto max-w-3xl overflow-hidden px-6 py-14 sm:py-16 lg:px-8 lg:py-20">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#D4AF37]/15 via-transparent to-black/50"
              aria-hidden
            />
            <div className="relative animate-fade-in-up">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-[#D4AF37]" aria-hidden />
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#D4AF37]">
                  Host registration
                </p>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                List your venue on Venora
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/65 sm:text-lg">
                Share a few details about you and your space. Our team reviews
                every application to keep the marketplace premium.
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="animate-fade-in-up delay-100 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xl shadow-neutral-200/50 sm:p-8 lg:p-10">
            <HostRegistrationForm />
          </div>
        </div>
      </main>
    </div>
  );
}
