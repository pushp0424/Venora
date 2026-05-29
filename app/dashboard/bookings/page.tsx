import type { Metadata } from "next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { clientBookings } from "@/data/clientDashboard";
import { clientSidebarNav } from "@/data/clientDashboard";
import { clientGetBookings } from "@/lib/admin/bookings";
import { requireClient } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Bookings — Venora",
  description: "View and manage your venue bookings.",
};

function statusStyles(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-neutral-900 text-white";
    case "pending":
      return "bg-[#D4AF37]/15 text-neutral-900 ring-1 ring-[#D4AF37]/40";
    case "cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

export default async function ClientBookingsPage() {
  const profile = await requireClient();
  const { data: dbBookings, error } = await clientGetBookings(profile.id);
  const bookings = dbBookings.length > 0 ? dbBookings : clientBookings;

  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="Bookings"
      subtitle="Your upcoming and past event reservations"
      activePath="/dashboard/bookings"
      dashboardRoot="/dashboard"
      navItems={clientSidebarNav}
      userInitial={initial}
    >
      {error && dbBookings.length === 0 ? (
        <p className="mb-4 text-sm text-amber-700">{error}</p>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-6 py-4 font-medium text-neutral-500">Venue</th>
                <th className="px-6 py-4 font-medium text-neutral-500">Date</th>
                <th className="px-6 py-4 font-medium text-neutral-500">Guests</th>
                <th className="px-6 py-4 font-medium text-neutral-500">Status</th>
                <th className="px-6 py-4 font-medium text-neutral-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="transition-colors hover:bg-neutral-50">
                  <td className="px-6 py-4 font-medium">{booking.venueName}</td>
                  <td className="px-6 py-4 text-neutral-600">{booking.eventDate}</td>
                  <td className="px-6 py-4 text-neutral-600">{booking.guests}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles(booking.status)}`}
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
    </DashboardLayout>
  );
}
