"use client";

import { useState } from "react";
import BookingModal from "@/components/BookingModal";

type VenueBookingProps = {
  venueName: string;
  venuePrice: string;
  venueRating: string;
  maxGuests?: number;
};

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
    </svg>
  );
}

export default function VenueBooking({
  venueName,
  venuePrice,
  venueRating,
  maxGuests,
}: VenueBookingProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm sm:p-8 lg:sticky lg:top-28">
        <p className="text-sm text-neutral-500">Starting from</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight">
          {venuePrice}
          <span className="text-base font-normal text-neutral-500"> / event</span>
        </p>
        <div className="mt-6 flex items-center gap-1 text-sm">
          <StarIcon className="h-4 w-4 text-neutral-900" />
          <span className="font-medium">{venueRating}</span>
          <span className="text-neutral-500">· Highly rated venue</span>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="mt-8 w-full rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-neutral-700"
        >
          Book Now
        </button>
        <p className="mt-4 text-center text-xs text-neutral-500">
          Instant confirmation · White-glove support
        </p>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        venueName={venueName}
        venuePrice={venuePrice}
        maxGuests={maxGuests}
      />
    </>
  );
}
