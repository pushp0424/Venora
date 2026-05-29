import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { clientSidebarNav, savedVenues } from "@/data/clientDashboard";
import { requireClient } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Saved Venues — Venora",
  description: "Your saved premium venues on Venora.",
};

export default async function SavedVenuesPage() {
  const profile = await requireClient();

  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="Saved Venues"
      subtitle="Spaces you have saved for upcoming events"
      activePath="/dashboard/saved-venues"
      dashboardRoot="/dashboard"
      navItems={clientSidebarNav}
      userInitial={initial}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedVenues.map((venue) => (
          <div
            key={venue.id}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
          >
            <div className="relative aspect-[4/3] bg-neutral-100">
              <Image
                src={venue.image}
                alt={venue.name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="font-semibold tracking-tight">{venue.name}</h3>
              <p className="mt-1 text-sm text-neutral-500">{venue.location}</p>
              <p className="mt-3 text-sm font-semibold">{venue.price} / event</p>
              <Link
                href={`/venue/${venue.id}`}
                className="mt-4 inline-flex text-sm font-medium text-[#D4AF37] hover:underline"
              >
                View venue →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
