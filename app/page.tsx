import { Suspense } from "react";
import BrowseByEventType from "@/components/BrowseByEventType";
import FeaturedVenues from "@/components/FeaturedVenues";
import FeaturedVenuesSkeleton from "@/components/FeaturedVenuesSkeleton";
import AIPlannerSection from "@/components/AIPlannerSection";
import BecomeAHostSection from "@/components/BecomeAHostSection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />
      <HeroSection />
      <BrowseByEventType />

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

      <TestimonialsSection />

      <BecomeAHostSection />

      <AIPlannerSection />

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
