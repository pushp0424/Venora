import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import VenuesListing from "@/components/VenuesListing";
import { getVenues } from "@/lib/venues";

export const metadata: Metadata = {
  title: "Venues — Venora",
  description:
    "Browse premium event venues for weddings, galas, corporate gatherings, and private celebrations.",
};

export default async function VenuesPage() {
  const { data, error } = await getVenues();

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <main className="pt-16 lg:pt-[4.5rem]">
        <header className="border-b border-neutral-100 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
              Venora collection
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              All venues
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-500 sm:text-xl">
              Explore our curated selection of premium spaces — from intimate
              studios to grand estates, ready for your next unforgettable event.
            </p>
          </div>
        </header>

        {error ? (
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
              <p className="text-sm font-semibold text-red-800">
                Unable to load venues
              </p>
              <p className="mt-2 text-sm text-red-600">{error}</p>
            </div>
          </div>
        ) : (
          <VenuesListing venues={data} />
        )}
      </main>
    </div>
  );
}
