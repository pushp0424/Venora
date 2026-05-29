const REVENUE_HIGHLIGHTS = [
  { value: "$2.4M+", label: "Booked through Venora" },
  { value: "40%", label: "Avg. inquiry increase" },
  { value: "12 days", label: "Avg. time to first booking" },
] as const;

const BENEFITS = [
  {
    title: "Premium exposure",
    description:
      "Reach event planners actively searching for curated, high-end venues.",
  },
  {
    title: "Qualified leads",
    description:
      "Connect with verified hosts planning weddings, galas, and corporate events.",
  },
  {
    title: "White-glove support",
    description:
      "Dedicated onboarding and listing optimization from our host success team.",
  },
  {
    title: "Full control",
    description:
      "Manage availability, pricing, and bookings from one elegant dashboard.",
  },
] as const;

function CheckIcon({ className }: { className?: string }) {
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
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  );
}

export default function BecomeAHostSection() {
  return (
    <section
      id="become-a-host"
      className="mx-6 mb-20 lg:mx-8 lg:mb-28"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#D4AF37]/15 via-transparent to-black/60"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/5 blur-3xl"
          aria-hidden
        />

        <div className="relative px-6 py-14 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div className="animate-fade-in-up">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-[#D4AF37]" aria-hidden />
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#D4AF37]">
                  For venue owners
                </p>
              </div>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Become a host on{" "}
                <span className="bg-gradient-to-r from-white to-[#D4AF37] bg-clip-text text-transparent">
                  Venora
                </span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
                List your venue on the premium marketplace trusted by planners
                worldwide. Turn exceptional spaces into a thriving events
                business with zero guesswork.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/sign-up?role=host"
                  className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-8 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#e0c04a] hover:shadow-lg hover:shadow-[#D4AF37]/25"
                >
                  Become a host
                </a>
                <a
                  href="#venues"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-white/5 hover:text-[#D4AF37]"
                >
                  Explore venues
                </a>
              </div>
            </div>

            <div className="animate-fade-in-up delay-100 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-5">
              {REVENUE_HIGHLIGHTS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-sm transition-colors duration-300 hover:border-[#D4AF37]/30 hover:bg-white/[0.07] sm:py-6"
                >
                  <p className="text-2xl font-semibold tracking-tight text-[#D4AF37] sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-white/55">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-up delay-200 mt-14 border-t border-white/10 pt-12 lg:mt-16">
            <h3 className="text-center text-sm font-medium uppercase tracking-[0.2em] text-[#D4AF37] sm:text-left">
              Why list on Venora
            </h3>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFITS.map((benefit, index) => (
                <li
                  key={benefit.title}
                  className={`animate-fade-in-up ${
                    ["delay-200", "delay-300", "delay-300", "delay-400"][index]
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/35">
                      <CheckIcon className="h-4 w-4 text-[#D4AF37]" />
                    </span>
                    <div>
                      <p className="font-semibold tracking-tight text-white">
                        {benefit.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
