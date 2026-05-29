import type { Metadata } from "next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { hostSidebarNav } from "@/data/hostDashboard";
import { requireHost } from "@/lib/auth";
import { hostGetVenueAnalytics } from "@/lib/host/venues";

export const metadata: Metadata = {
  title: "Analytics — Venora Host",
};

export default async function HostAnalyticsPage() {
  const profile = await requireHost();
  const { data, error } = await hostGetVenueAnalytics(profile.id);

  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Performance for your venues only"
      activePath="/host/dashboard/analytics"
      dashboardRoot="/host/dashboard"
      navItems={hostSidebarNav}
      userInitial={initial}
    >
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total listings", value: data.venueCount },
            { label: "Pending approval", value: data.pendingCount },
            { label: "Live on Venora", value: data.approvedCount },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-neutral-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[#D4AF37]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
