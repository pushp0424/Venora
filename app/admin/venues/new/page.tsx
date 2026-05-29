import type { Metadata } from "next";
import AdminVenueForm from "@/components/admin/AdminVenueForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminSidebarNav } from "@/data/adminDashboard";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Add Venue — Venora Admin",
};

export default async function AdminNewVenuePage() {
  const profile = await requireAdmin();
  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="Add venue"
      subtitle="Create a new platform listing"
      activePath="/admin/venues"
      dashboardRoot="/admin"
      navItems={adminSidebarNav}
      userInitial={initial}
    >
      <AdminVenueForm />
    </DashboardLayout>
  );
}
