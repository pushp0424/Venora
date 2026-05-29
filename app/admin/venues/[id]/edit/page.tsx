import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminVenueForm from "@/components/admin/AdminVenueForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminSidebarNav } from "@/data/adminDashboard";
import { adminGetVenueById } from "@/lib/admin/venues";
import { requireAdmin } from "@/lib/auth";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Edit ${id} — Venora Admin` };
}

export default async function AdminEditVenuePage({ params }: PageProps) {
  const profile = await requireAdmin();
  const { id } = await params;
  const venue = await adminGetVenueById(id);

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
      activePath="/admin/venues"
      dashboardRoot="/admin"
      navItems={adminSidebarNav}
      userInitial={initial}
    >
      <AdminVenueForm venue={venue} />
    </DashboardLayout>
  );
}
