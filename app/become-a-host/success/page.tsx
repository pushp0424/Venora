import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Application Received — Venora",
  description: "Your host application has been submitted successfully.",
};

function CheckCircleIcon({ className }: { className?: string }) {
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
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

export default function BecomeAHostSuccessPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <main className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-6 pt-16 pb-20 lg:pt-[4.5rem]">
        <div className="animate-fade-in-up mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/15 ring-2 ring-[#D4AF37]/40">
            <CheckCircleIcon className="h-9 w-9 text-[#D4AF37]" />
          </div>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Application received
          </h1>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
            Thank you for applying as a host. Our team will review your venue
            and contact you shortly.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
            >
              Back to home
            </Link>
            <Link
              href="/#venues"
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-8 py-3.5 text-sm font-semibold text-neutral-900 transition-all hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
            >
              Explore venues
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
