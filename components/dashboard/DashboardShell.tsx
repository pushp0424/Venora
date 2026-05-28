"use client";

import Image from "next/image";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SuccessToast from "@/components/dashboard/SuccessToast";
import { useVendorVenues } from "@/context/VendorVenuesContext";
import { dashboardStats, recentBookings } from "@/data/dashboard";

function statusStyles(status: string) {
  switch (status) {
    case "Confirmed":
    case "Active":
      return "bg-neutral-900 text-white";
    case "Pending":
    case "Draft":
      return "bg-neutral-100 text-neutral-700";
    case "Paused":
      return "bg-amber-50 text-amber-800";
    case "Cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

export default function DashboardShell() {
  const { venues, successMessage, setSuccessMessage } = useVendorVenues();

  const stats = dashboardStats.map((stat) =>
    stat.label === "Active venues"
      ? { ...stat, value: String(venues.length) }
      : stat
  );

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back, Vendor"
      activePath="/dashboard"
    >
      {successMessage ? (
        <SuccessToast
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{stat.value}</p>
            <p
              className={`mt-2 text-sm font-medium ${
                stat.trend === "up" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {stat.change} vs last month
            </p>
          </div>
        ))}
      </div>

      <section id="venues" className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">My Venues</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Manage and monitor your listed spaces
            </p>
          </div>
          <Link
            href="/dashboard/add-venue"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Venue
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                  sizes="(max-width: 640px) 100vw, 25vw"
                  unoptimized={venue.image.startsWith("blob:")}
                  className="object-cover"
                />
                <span
                  className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles(venue.status)}`}
                >
                  {venue.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold tracking-tight">{venue.name}</h3>
                <p className="mt-0.5 text-sm text-neutral-500">{venue.location}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-neutral-500">{venue.bookings} bookings</span>
                  <span className="font-semibold">{venue.revenue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="bookings" className="mt-10">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Recent bookings</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Latest reservation requests across your venues
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-6 py-4 font-medium text-neutral-500">Guest</th>
                  <th className="px-6 py-4 font-medium text-neutral-500">Venue</th>
                  <th className="px-6 py-4 font-medium text-neutral-500">Date</th>
                  <th className="px-6 py-4 font-medium text-neutral-500">Guests</th>
                  <th className="px-6 py-4 font-medium text-neutral-500">Status</th>
                  <th className="px-6 py-4 font-medium text-neutral-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="transition-colors hover:bg-neutral-50">
                    <td className="px-6 py-4 font-medium">{booking.guestName}</td>
                    <td className="px-6 py-4 text-neutral-600">{booking.venue}</td>
                    <td className="px-6 py-4 text-neutral-600">{booking.eventDate}</td>
                    <td className="px-6 py-4 text-neutral-600">{booking.guests}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
