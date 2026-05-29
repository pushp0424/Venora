import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#D4AF37]/12 via-transparent to-black"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#D4AF37]"
        >
          <span aria-hidden>←</span>
          Back to Venora
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-[#D4AF37]" aria-hidden />
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#D4AF37]">
              Venora
            </p>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
          {children}
        </div>

        <div className="mt-8 text-center text-sm text-white/55">{footer}</div>
      </div>
    </div>
  );
}
