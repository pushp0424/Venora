import Image from "next/image";

function SearchIcon({ className }: { className?: string }) {
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
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}

const HERO_STATS = [
  { value: "500+", label: "Venues" },
  { value: "50+", label: "Cities" },
  { value: "10,000+", label: "Events" },
  { value: "4.9", label: "Average Rating" },
] as const;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=80";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden pt-16 text-white lg:pt-[4.5rem]">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="animate-hero-bg object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-black/65"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/85"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/15 via-transparent to-black/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="animate-fade-in-up mb-5 flex items-center gap-3">
          <span
            className="h-px w-8 bg-[#D4AF37] sm:w-12"
            aria-hidden
          />
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#D4AF37] sm:text-sm">
            Premium venue discovery
          </p>
        </div>

        <h1 className="animate-fade-in-up delay-100 max-w-4xl font-semibold leading-[1.08] tracking-tight">
          <span className="block text-3xl sm:text-5xl lg:text-7xl">
            Book premium venues
          </span>
          <span className="mt-1 block text-3xl font-light text-white/90 sm:mt-2 sm:text-5xl lg:text-6xl">
            for{" "}
            <span className="bg-gradient-to-r from-white via-white to-[#D4AF37] bg-clip-text font-normal text-transparent">
              unforgettable moments.
            </span>
          </span>
        </h1>

        <p className="animate-fade-in-up delay-200 mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:mt-6 sm:max-w-2xl sm:text-lg lg:text-xl">
          Discover curated spaces for weddings, launches, and private events.
          Compare instantly, book confidently, and host with style.
        </p>

        <div className="animate-fade-in-up delay-300 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#venues"
            className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-7 py-3.5 text-sm font-semibold text-black shadow-lg shadow-[#D4AF37]/20 transition-all hover:bg-[#e0c04a] hover:shadow-[#D4AF37]/30"
          >
            Explore venues
          </a>
          <a
            href="/sign-up?role=host"
            className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-[#D4AF37]/60 hover:bg-white/10"
          >
            Become a host
          </a>
        </div>

        <div className="animate-fade-in-up delay-400 mt-10 w-full lg:mt-12">
          <form
            className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:p-1.5 lg:max-w-3xl"
            action="#venues"
          >
            <label className="sr-only" htmlFor="location">
              Location
            </label>
            <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 sm:rounded-full sm:py-2.5">
              <SearchIcon className="h-5 w-5 shrink-0 text-neutral-400" />
              <input
                id="location"
                type="text"
                placeholder="Where is your event?"
                className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none sm:text-base"
              />
            </div>
            <div className="hidden h-8 w-px bg-neutral-200 sm:block" />
            <label className="sr-only" htmlFor="date">
              Date
            </label>
            <div className="flex flex-1 items-center gap-3 rounded-xl border-t border-neutral-200 px-4 py-3 sm:border-0 sm:rounded-full sm:py-2.5">
              <input
                id="date"
                type="text"
                placeholder="Add dates"
                className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none sm:text-base"
              />
            </div>
            <div className="hidden h-8 w-px bg-neutral-200 sm:block" />
            <label className="sr-only" htmlFor="guests">
              Guests
            </label>
            <div className="flex flex-1 items-center gap-3 rounded-xl border-t border-neutral-200 px-4 py-3 sm:border-0 sm:rounded-full sm:py-2.5">
              <input
                id="guests"
                type="text"
                placeholder="Guest count"
                className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-black sm:rounded-full sm:py-3"
            >
              <SearchIcon className="h-4 w-4 text-[#D4AF37]" />
              Search
            </button>
          </form>
          <p className="mt-4 text-sm text-white/55">
            Trusted by 2,000+ event planners worldwide
          </p>
        </div>
      </div>

      <div className="animate-fade-in-up delay-500 relative z-10 mt-auto border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:gap-8 sm:px-6 sm:py-10 lg:px-8">
          {HERO_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`animate-fade-in-up text-center sm:text-left ${
                ["delay-500", "delay-500", "delay-600", "delay-600"][index]
              }`}
            >
              <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                <span className="text-[#D4AF37]">{stat.value}</span>
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-white/60 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
