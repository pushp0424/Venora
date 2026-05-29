import Image from "next/image";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  clientBookings,
  clientDashboardStats,
  clientSidebarNav,
  savedVenues,
} from "@/data/clientDashboard";
import type { UserProfile } from "@/data/user";

function statusStyles(status: string) {
  switch (status) {
    case "Confirmed":
      return "bg-neutral-900 text-white";
    case "Pending":
      return "bg-[#D4AF37]/15 text-neutral-900 ring-1 ring-[#D4AF37]/40";
    case "Cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

type ClientDashboardShellProps = {
  profile: UserProfile;
};

export default function ClientDashboardShell({
  profile,
}: ClientDashboardShellProps) {
  const userInitial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`Welcome back, ${profile.fullName ?? "Client"}`}
      activePath="/dashboard"
      dashboardRoot="/dashboard"
      navItems={clientSidebarNav}
      userInitial={userInitial}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {clientDashboardStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{stat.value}</p>
            <p className="mt-2 text-sm font-medium text-[#D4AF37]">{stat.change}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Quick actions</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Continue planning your next event
            </p>
          </div>
          <Link
            href="/venues"
            className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
          >
            Explore venues
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/saved-venues"
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-[#D4AF37]/40 hover:shadow-md"
          >
            <h3 className="font-semibold tracking-tight">Saved venues</h3>
            <p className="mt-2 text-sm text-neutral-500">
              {savedVenues.length} venues saved for later
            </p>
          </Link>
          <Link
            href="/dashboard/bookings"
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-[#D4AF37]/40 hover:shadow-md"
          >
            <h3 className="font-semibold tracking-tight">Your bookings</h3>
            <p className="mt-2 text-sm text-neutral-500">
              {clientBookings.length} active reservations
            </p>
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Recently saved</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {savedVenues.slice(0, 2).map((venue) => (
            <div
              key={venue.id}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10] bg-neutral-100">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold tracking-tight">{venue.name}</h3>
                <p className="mt-0.5 text-sm text-neutral-500">{venue.location}</p>
                <p className="mt-2 text-sm font-semibold">{venue.price} / event</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
