import FeaturedVenuesGrid from "@/components/FeaturedVenuesGrid";
import { getVenues } from "@/lib/venues";

export default async function FeaturedVenues() {
  const { data, error } = await getVenues();

  if (error) {
    return (
      <section id="venues" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Featured venues
          </h2>
          <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="text-sm font-semibold text-red-800">
              Unable to load venues
            </p>
            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (data.length === 0) {
    return (
      <section id="venues" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Featured venues
          </h2>
          <div className="mt-12 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
            <p className="text-lg font-semibold tracking-tight text-neutral-900">
              No venues available yet
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Check back soon or browse all venues.
            </p>
            <a
              href="/venues"
              className="mt-6 inline-flex rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-700"
            >
              View venues
            </a>
          </div>
        </div>
      </section>
    );
  }

  return <FeaturedVenuesGrid venues={data} />;
}
