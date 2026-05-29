import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { hostSidebarNav } from "@/data/hostDashboard";
import { requireHost } from "@/lib/auth";
import { hostGetOwnVenues } from "@/lib/host/venues";

export const metadata: Metadata = {
  title: "My Venues — Venora Host",
};

export default async function HostVenuesPage() {
  const profile = await requireHost();
  const { data: venues, error } = await hostGetOwnVenues(profile.id);

  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="My venues"
      subtitle="Manage your listings, pricing, and availability"
      activePath="/host/dashboard/venues"
      dashboardRoot="/host/dashboard"
      navItems={hostSidebarNav}
      userInitial={initial}
    >
      <div className="mb-6 flex justify-end">
        <Link
          href="/host/dashboard/venues/new"
          className="rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-black"
        >
          Add venue
        </Link>
      </div>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : venues.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center text-sm text-neutral-500">
          No venues yet. Add your first space to get started.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10] bg-neutral-100">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium capitalize">
                  {venue.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{venue.name}</h3>
                <p className="text-sm text-neutral-500">{venue.location}</p>
                <p className="mt-2 text-sm font-semibold">{venue.price}</p>
                <p className="mt-1 text-xs capitalize text-neutral-500">
                  {venue.availability}
                </p>
                <Link
                  href={`/host/dashboard/venues/${venue.id}/edit`}
                  className="mt-3 inline-block text-sm font-medium text-[#D4AF37] hover:underline"
                >
                  Edit venue →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
