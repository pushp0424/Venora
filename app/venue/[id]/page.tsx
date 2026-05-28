import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import VenueBooking from "@/components/VenueBooking";
import { getVenueById, getVenues } from "@/lib/venues";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const { data } = await getVenues();
  return data.map((venue) => ({ id: venue.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const venue = await getVenueById(id);

  if (!venue) {
    return { title: "Venue not found — Venora" };
  }

  return {
    title: `${venue.name} — Venora`,
    description: venue.description,
  };
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
    </svg>
  );
}

export default async function VenueDetailPage({ params }: PageProps) {
  const { id } = await params;
  const venue = await getVenueById(id);

  if (!venue) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <main className="pt-16 lg:pt-[4.5rem]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/venues"
            className="inline-flex items-center gap-2 py-6 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <span aria-hidden>←</span>
            Back to all venues
          </Link>

          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100 sm:rounded-3xl">
            <Image
              src={venue.image}
              alt={venue.name}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-900 backdrop-blur-sm sm:left-6 sm:top-6">
              {venue.tag}
            </span>
          </div>

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[1fr_360px] lg:gap-16">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
                {venue.location}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                {venue.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4 text-neutral-900" />
                  <span className="font-medium">{venue.rating}</span>
                  <span className="text-neutral-500">rating</span>
                </div>
                <span className="text-neutral-300">|</span>
                <span className="text-neutral-600">{venue.capacity}</span>
              </div>

              <div className="mt-10 border-t border-neutral-100 pt-10">
                <h2 className="text-lg font-semibold tracking-tight">About this venue</h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
                  {venue.description}
                </p>
              </div>

              <div className="mt-10 border-t border-neutral-100 pt-10">
                <h2 className="text-lg font-semibold tracking-tight">Capacity</h2>
                <p className="mt-3 text-neutral-600">{venue.capacity}</p>
              </div>
            </div>

            <aside className="lg:pt-2">
              <VenueBooking
                venueName={venue.name}
                venuePrice={venue.price}
                venueRating={venue.rating}
                maxGuests={venue.capacityMax}
              />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
