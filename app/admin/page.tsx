import type { Metadata } from "next";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminSidebarNav } from "@/data/adminDashboard";
import { adminGetPlatformAnalytics } from "@/lib/admin/analytics";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin — Venora",
  description: "Venora platform administration.",
};

export default async function AdminOverviewPage() {
  const profile = await requireAdmin();
  const { data: analytics, error } = await adminGetPlatformAnalytics();

  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="Platform overview"
      subtitle="Analytics and quick actions"
      activePath="/admin"
      dashboardRoot="/admin"
      navItems={adminSidebarNav}
      userInitial={initial}
    >
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {analytics ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Total venues", value: analytics.totalVenues },
            { label: "Pending venues", value: analytics.pendingVenues },
            { label: "Approved venues", value: analytics.approvedVenues },
            { label: "Registered hosts", value: analytics.totalHosts },
            {
              label: "Pending host applications",
              value: analytics.pendingHostApplications,
            },
            { label: "Total bookings", value: analytics.totalBookings },
            { label: "Confirmed bookings", value: analytics.confirmedBookings },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-neutral-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#D4AF37]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/venues"
          className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Manage venues
        </Link>
        <Link
          href="/admin/hosts"
          className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-semibold"
        >
          Review hosts
        </Link>
        <Link
          href="/admin/bookings"
          className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-semibold"
        >
          View bookings
        </Link>
      </div>
    </DashboardLayout>
  );
}
