import type { Metadata } from "next";
import HostVenueForm from "@/components/host/HostVenueForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { hostSidebarNav } from "@/data/hostDashboard";
import { requireHost } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Add Venue — Venora Host",
};

export default async function HostNewVenuePage() {
  const profile = await requireHost();
  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="Add venue"
      subtitle="Submit a new listing for approval"
      activePath="/host/dashboard/venues"
      dashboardRoot="/host/dashboard"
      navItems={hostSidebarNav}
      userInitial={initial}
    >
      <HostVenueForm />
    </DashboardLayout>
  );
}
