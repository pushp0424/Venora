import Link from "next/link";
import type { ComponentType } from "react";

type EventType = {
  label: string;
  slug: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
};

function WeddingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M3 12h2m14 0h2M5.6 18.4l1.4-1.4m10-10 1.4-1.4" />
      <circle cx="12" cy="12" r="4.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 19.5c.8-2.2 2.1-3.5 3.5-3.5s2.7 1.3 3.5 3.5" />
    </svg>
  );
}

function CorporateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
    </svg>
  );
}

function BirthdayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13M8 21h8M6 8h12l-1-4H7l-1 4zM9 4a3 3 0 0 1 6 0" />
      <path strokeLinecap="round" d="M5 12h2M9 12h2M13 12h2M17 12h2" />
    </svg>
  );
}

function EngagementIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-4.35-6-10a6 6 0 0 1 12 0c0 5.65-6 10-6 10z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v2m0-4h.01" />
      <circle cx="12" cy="9" r="1.5" />
    </svg>
  );
}

function ConferenceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v10H4V6zM8 20h8M12 16v4" />
      <circle cx="8" cy="11" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="16" cy="11" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ConcertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.25} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V6l10-2v12M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm12-2c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
    </svg>
  );
}

const EVENT_TYPES: EventType[] = [
  {
    label: "Wedding",
    slug: "wedding",
    description: "Elegant estates & ballrooms",
    Icon: WeddingIcon,
  },
  {
    label: "Corporate",
    slug: "corporate",
    description: "Boardrooms & summit halls",
    Icon: CorporateIcon,
  },
  {
    label: "Birthday",
    slug: "birthday",
    description: "Private lounges & rooftops",
    Icon: BirthdayIcon,
  },
  {
    label: "Engagement",
    slug: "engagement",
    description: "Intimate garden settings",
    Icon: EngagementIcon,
  },
  {
    label: "Conference",
    slug: "conference",
    description: "Tech-ready event spaces",
    Icon: ConferenceIcon,
  },
  {
    label: "Concert",
    slug: "concert",
    description: "Stages & open-air venues",
    Icon: ConcertIcon,
  },
];

const ENTRANCE_DELAYS = [
  "delay-100",
  "delay-100",
  "delay-200",
  "delay-200",
  "delay-300",
  "delay-300",
];

export default function BrowseByEventType() {
  return (
    <section
      id="event-types"
      className="relative overflow-hidden border-y border-neutral-800 bg-neutral-950 py-16 text-white sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#D4AF37]/8 via-transparent to-black/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="animate-fade-in-up mx-auto max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#D4AF37]" aria-hidden />
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#D4AF37]">
              Curated collections
            </p>
            <span className="h-px w-10 bg-[#D4AF37]" aria-hidden />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Browse by Event Type
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            Find the perfect setting for every celebration — from intimate
            gatherings to grand productions.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-5">
          {EVENT_TYPES.map((event, index) => (
            <Link
              key={event.slug}
              href={`/venues?event=${event.slug}`}
              className={`animate-fade-in-up group relative flex flex-col items-center rounded-2xl border border-white/10 bg-black/40 px-3 py-6 text-center backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#D4AF37]/45 hover:bg-black/60 hover:shadow-lg hover:shadow-[#D4AF37]/15 sm:px-4 sm:py-7 ${ENTRANCE_DELAYS[index]}`}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-gradient-to-br from-[#D4AF37]/15 to-transparent transition-all duration-300 group-hover:scale-110 group-hover:border-[#D4AF37]/60 group-hover:from-[#D4AF37]/25 group-hover:shadow-md group-hover:shadow-[#D4AF37]/20 sm:h-16 sm:w-16">
                <event.Icon className="h-7 w-7 text-[#D4AF37] transition-transform duration-300 group-hover:scale-105 sm:h-8 sm:w-8" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-[#D4AF37] sm:text-base">
                {event.label}
              </h3>
              <p className="mt-1.5 hidden text-xs leading-snug text-white/45 transition-colors duration-300 group-hover:text-white/60 sm:block">
                {event.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
