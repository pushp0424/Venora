type Testimonial = {
  name: string;
  initials: string;
  eventType: string;
  review: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Mitchell",
    initials: "SM",
    eventType: "Wedding",
    review:
      "Venora made finding our dream venue effortless. The booking process was seamless, and the space exceeded every expectation for our celebration.",
  },
  {
    name: "James Chen",
    initials: "JC",
    eventType: "Corporate Gala",
    review:
      "We hosted our annual summit through Venora and were impressed by the curated selection and white-glove support from inquiry to event day.",
  },
  {
    name: "Priya Sharma",
    initials: "PS",
    eventType: "Engagement",
    review:
      "From discovery to confirmation, everything felt premium. The venue team was exceptional, and our guests are still talking about the evening.",
  },
];

const CARD_DELAYS = ["delay-100", "delay-200", "delay-300"];

function StarRating() {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label="5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 text-[#D4AF37]"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
        </svg>
      ))}
    </div>
  );
}

function AvatarPlaceholder({ initials, name }: { initials: string; name: string }) {
  return (
    <div
      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-800 to-neutral-950 text-sm font-semibold tracking-wide text-[#D4AF37] ring-2 ring-[#D4AF37]/40 ring-offset-2 ring-offset-white sm:h-16 sm:w-16 sm:text-base"
      aria-hidden
    >
      {initials}
      <span className="sr-only">{name}</span>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden border-t border-neutral-100 bg-neutral-50 py-20 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-[#D4AF37]/5"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="animate-fade-in-up mx-auto max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#D4AF37]" aria-hidden />
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#D4AF37]">
              Client stories
            </p>
            <span className="h-px w-10 bg-[#D4AF37]" aria-hidden />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Loved by event planners
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500 sm:text-base">
            Hear from hosts who discovered exceptional venues through Venora.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className={`animate-fade-in-up group relative flex flex-col rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#D4AF37]/35 hover:shadow-lg hover:shadow-[#D4AF37]/10 sm:p-8 ${CARD_DELAYS[index]}`}
            >
              <span
                className="pointer-events-none absolute right-6 top-6 font-serif text-5xl leading-none text-[#D4AF37]/20 transition-colors duration-300 group-hover:text-[#D4AF37]/35"
                aria-hidden
              >
                &ldquo;
              </span>

              <StarRating />

              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-neutral-600 sm:text-[0.9375rem]">
                {testimonial.review}
              </blockquote>

              <footer className="mt-6 flex items-center gap-4 border-t border-neutral-100 pt-6">
                <AvatarPlaceholder
                  initials={testimonial.initials}
                  name={testimonial.name}
                />
                <div className="min-w-0">
                  <p className="font-semibold tracking-tight text-neutral-950">
                    {testimonial.name}
                  </p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.12em] text-[#D4AF37]">
                    {testimonial.eventType}
                  </p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
