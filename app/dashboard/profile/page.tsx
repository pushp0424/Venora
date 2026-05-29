import type { Metadata } from "next";
import ProfileForm from "@/components/dashboard/ProfileForm";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { clientSidebarNav } from "@/data/clientDashboard";
import { requireClient } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Profile — Venora",
};

export default async function ClientProfilePage() {
  const profile = await requireClient();

  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="Profile"
      subtitle="Manage your account details"
      activePath="/dashboard/profile"
      dashboardRoot="/dashboard"
      navItems={clientSidebarNav}
      userInitial={initial}
    >
      <ProfileForm profile={profile} />
    </DashboardLayout>
  );
}
