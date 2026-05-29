import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HostVenueForm from "@/components/host/HostVenueForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { hostSidebarNav } from "@/data/hostDashboard";
import { requireHost } from "@/lib/auth";
import { hostGetVenueById } from "@/lib/host/venues";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function HostEditVenuePage({ params }: PageProps) {
  const profile = await requireHost();
  const { id } = await params;
  const venue = await hostGetVenueById(profile.id, id);

  if (!venue) {
    notFound();
  }

  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="Edit venue"
      subtitle={venue.name}
      activePath="/host/dashboard/venues"
      dashboardRoot="/host/dashboard"
      navItems={hostSidebarNav}
      userInitial={initial}
    >
      <HostVenueForm venue={venue} />
    </DashboardLayout>
  );
}
