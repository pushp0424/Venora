import { Suspense } from "react";
import FeaturedVenues from "@/components/FeaturedVenues";
import FeaturedVenuesSkeleton from "@/components/FeaturedVenuesSkeleton";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />
      <HeroSection />

      {/* How it works strip */}
      <section
        id="how-it-works"
        className="border-b border-neutral-100 bg-neutral-50"
      >
        <div className="mx-auto grid max-w-7xl divide-y divide-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { step: "01", title: "Discover", desc: "Browse curated premium venues" },
            { step: "02", title: "Compare", desc: "Transparent pricing, no surprises" },
            { step: "03", title: "Book", desc: "Instant confirmation, white-glove support" },
          ].map((item, i) => (
            <div
              key={item.step}
              className={`animate-fade-in-up px-8 py-10 ${["delay-100", "delay-200", "delay-300"][i]}`}
            >
              <span className="text-xs font-medium text-neutral-400">
                {item.step}
              </span>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-neutral-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Suspense fallback={<FeaturedVenuesSkeleton />}>
        <FeaturedVenues />
      </Suspense>

      {/* CTA */}
      <section className="mx-6 mb-20 lg:mx-8 lg:mb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-neutral-950 px-8 py-16 text-center text-white sm:px-16 sm:py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2), transparent 50%)",
            }}
          />
          <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to host something
            <br className="hidden sm:block" />
            extraordinary?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-neutral-400">
            Join thousands of planners who book with confidence. List your venue
            or start exploring today.
          </p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#venues"
              className="w-full rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-100 hover:shadow-lg sm:w-auto"
            >
              Explore venues
            </a>
            <a
              href="#"
              className="w-full rounded-full border border-neutral-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-neutral-400 hover:bg-white/5 sm:w-auto"
            >
              Become a host
            </a>
          </div>
        </div>
      </section>
      <section className="py-24">
  <h2 className="text-5xl font-bold mb-4">
    Plan your event with AI
  </h2>

  <p className="text-gray-500 mb-8">
    Describe your dream event and Venora will curate venues instantly.
  </p>

  <div className="rounded-3xl border p-6 bg-white shadow-xl">
    <input
      className="w-full border rounded-xl p-4"
      placeholder="Need a rooftop venue for 150 guests under $3000"
    />

    <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl">
      Generate Recommendations
    </button>
  </div>
</section>
      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <a href="#" className="text-xl font-semibold tracking-tight">
                Venora
              </a>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
                The premium platform for discovering and booking exceptional
                event venues.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="mt-4 space-y-3">
                {["Explore", "Pricing", "For hosts", "Mobile app"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="mt-4 space-y-3">
                {["About", "Careers", "Press", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Legal</h4>
              <ul className="mt-4 space-y-3">
                {["Privacy", "Terms", "Cookies"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-8 sm:flex-row">
            <p className="text-sm text-neutral-400">
              © 2026 Venora, Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Instagram", "X", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm text-neutral-400 transition-colors hover:text-neutral-900"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  );


}
