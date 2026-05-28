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

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 pt-16 text-white lg:pt-[4.5rem]">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,255,255,0.15), transparent)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
        <p className="animate-fade-in-up mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-300">
          Premium venue discovery
        </p>
        <h1 className="animate-fade-in-up delay-100 max-w-5xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
          Book premium venues
          <br />
          <span className="text-neutral-300">for unforgettable moments.</span>
        </h1>
        <p className="animate-fade-in-up delay-200 mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300 sm:text-xl">
          Discover curated spaces for weddings, launches, and private events.
          Compare instantly, book confidently, and host with style.
        </p>

        <div className="animate-fade-in-up delay-300 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#venues"
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-100"
          >
            Explore venues
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full border border-neutral-600 px-7 py-3 text-sm font-semibold text-white transition-all hover:border-neutral-400 hover:bg-white/5"
          >
            Become a host
          </a>
        </div>

        <div className="animate-fade-in-up delay-400 mt-10 lg:mt-12">
          <form
            className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-3 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:rounded-full sm:p-2 lg:max-w-3xl"
            action="#venues"
          >
            <label className="sr-only" htmlFor="location">
              Location
            </label>
            <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 sm:rounded-full sm:py-2.5">
              <SearchIcon className="h-5 w-5 shrink-0 text-neutral-500" />
              <input
                id="location"
                type="text"
                placeholder="Where is your event?"
                className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none sm:text-base"
              />
            </div>
            <div className="hidden h-8 w-px bg-neutral-700 sm:block" />
            <label className="sr-only" htmlFor="date">
              Date
            </label>
            <div className="flex flex-1 items-center gap-3 rounded-xl border-t border-neutral-800 px-4 py-3 sm:border-0 sm:rounded-full sm:py-2.5">
              <input
                id="date"
                type="text"
                placeholder="Add dates"
                className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none sm:text-base"
              />
            </div>
            <div className="hidden h-8 w-px bg-neutral-700 sm:block" />
            <label className="sr-only" htmlFor="guests">
              Guests
            </label>
            <div className="flex flex-1 items-center gap-3 rounded-xl border-t border-neutral-800 px-4 py-3 sm:border-0 sm:rounded-full sm:py-2.5">
              <input
                id="guests"
                type="text"
                placeholder="Guest count"
                className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-100 sm:rounded-full sm:py-3"
            >
              <SearchIcon className="h-4 w-4" />
              Search
            </button>
          </form>
          <p className="mt-4 text-sm text-neutral-400">
            Trusted by 2,000+ event planners worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
