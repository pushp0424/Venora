import type { Metadata } from "next";
import Link from "next/link";
import AdminVenueActions from "@/components/admin/AdminVenueActions";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminSidebarNav } from "@/data/adminDashboard";
import { adminGetAllVenues } from "@/lib/admin/venues";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Manage Venues — Venora Admin",
};

export default async function AdminVenuesPage() {
  const profile = await requireAdmin();
  const { data: venues, error } = await adminGetAllVenues();

  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="All venues"
      subtitle="Add, edit, approve, or remove listings"
      activePath="/admin/venues"
      dashboardRoot="/admin/dashboard"
      navItems={adminSidebarNav}
      userInitial={initial}
    >
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/venues/new"
          className="rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-black"
        >
          Add venue
        </Link>
      </div>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-4 py-3 font-medium text-neutral-500">Name</th>
                  <th className="px-4 py-3 font-medium text-neutral-500">City</th>
                  <th className="px-4 py-3 font-medium text-neutral-500">Status</th>
                  <th className="px-4 py-3 font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {venues.map((venue) => (
                  <tr key={venue.id}>
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/admin/venues/${venue.id}/edit`}
                        className="hover:underline"
                      >
                        {venue.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{venue.city}</td>
                    <td className="px-4 py-3 capitalize">{venue.status}</td>
                    <td className="px-4 py-3">
                      <AdminVenueActions
                        venueId={venue.id}
                        status={venue.status}
                      />
                    </td>
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
