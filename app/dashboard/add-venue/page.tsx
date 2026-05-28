import type { Metadata } from "next";
import AddVenueForm from "@/components/dashboard/AddVenueForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export const metadata: Metadata = {
  title: "Add Venue — Venora Dashboard",
  description: "List a new premium venue on Venora.",
};

export default function AddVenuePage() {
  return (
    <DashboardLayout
      title="Add Venue"
      subtitle="Create a new listing for your space"
      activePath="/dashboard/add-venue"
    >
      <AddVenueForm />
    </DashboardLayout>
  );
}
