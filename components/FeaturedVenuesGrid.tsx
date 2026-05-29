import FeaturedVenuesCarousel from "@/components/FeaturedVenuesCarousel";
import type { Venue } from "@/data/venues";

type FeaturedVenuesGridProps = {
  venues: Venue[];
};

export default function FeaturedVenuesGrid({ venues }: FeaturedVenuesGridProps) {
  return (
    <section id="venues" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Featured venues
            </h2>
            <p className="mt-2 max-w-md text-neutral-500">
              Handpicked spaces loved by planners for their design, service, and
              seamless experience.
            </p>
          </div>
          <a
            href="/venues"
            className="group inline-flex items-center gap-1 text-sm font-medium text-neutral-900"
          >
            View all
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        <div className="mt-12 md:px-6">
          <FeaturedVenuesCarousel venues={venues} />
        </div>
      </div>
    </section>
  );
}
