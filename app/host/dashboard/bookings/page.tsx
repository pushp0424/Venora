import type { Metadata } from "next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { hostSidebarNav } from "@/data/hostDashboard";
import { hostGetBookings } from "@/lib/admin/bookings";
import { requireHost } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Booking Requests — Venora Host",
};

export default async function HostBookingsPage() {
  const profile = await requireHost();
  const { data: bookings, error } = await hostGetBookings(profile.id);

  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="Booking requests"
      subtitle="Incoming reservations for your venues"
      activePath="/host/dashboard/bookings"
      dashboardRoot="/host/dashboard"
      navItems={hostSidebarNav}
      userInitial={initial}
    >
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center text-sm text-neutral-500">
          No booking requests yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-4 py-3 font-medium text-neutral-500">Guest</th>
                  <th className="px-4 py-3 font-medium text-neutral-500">Venue</th>
                  <th className="px-4 py-3 font-medium text-neutral-500">Date</th>
                  <th className="px-4 py-3 font-medium text-neutral-500">Status</th>
                  <th className="px-4 py-3 font-medium text-neutral-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-medium">{b.clientName}</td>
                    <td className="px-4 py-3">{b.venueName}</td>
                    <td className="px-4 py-3">{b.eventDate}</td>
                    <td className="px-4 py-3 capitalize">{b.status}</td>
                    <td className="px-4 py-3 font-semibold">{b.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
