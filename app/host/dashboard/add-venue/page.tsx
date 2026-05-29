import type { Metadata } from "next";
import AddVenueForm from "@/components/dashboard/AddVenueForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { hostSidebarNav } from "@/data/hostDashboard";

export const metadata: Metadata = {
  title: "Add Venue — Venora Host",
  description: "List a new premium venue on Venora.",
};

export default function HostAddVenuePage() {
  return (
    <DashboardLayout
      title="Add Venue"
      subtitle="Create a new listing for your space"
      activePath="/host/dashboard/add-venue"
      dashboardRoot="/host/dashboard"
      navItems={hostSidebarNav}
    >
      <AddVenueForm />
    </DashboardLayout>
  );
}
