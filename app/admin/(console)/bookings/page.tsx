import type { Metadata } from "next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminSidebarNav } from "@/data/adminDashboard";
import { adminGetAllBookings } from "@/lib/admin/bookings";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Bookings — Venora Admin",
};

function statusClass(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-neutral-900 text-white";
    case "cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-[#D4AF37]/15 text-neutral-900";
  }
}

export default async function AdminBookingsPage() {
  const profile = await requireAdmin();
  const { data: bookings, error } = await adminGetAllBookings();

  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="All bookings"
      subtitle="Platform-wide reservation activity"
      activePath="/admin/bookings"
      dashboardRoot="/admin/dashboard"
      navItems={adminSidebarNav}
      userInitial={initial}
    >
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center text-sm text-neutral-500">
          No bookings recorded yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-4 py-3 font-medium text-neutral-500">Client</th>
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
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClass(b.status)}`}
                      >
                        {b.status}
                      </span>
                    </td>
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
