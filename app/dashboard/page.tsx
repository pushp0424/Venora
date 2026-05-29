import type { Metadata } from "next";
import ClientDashboardShell from "@/components/dashboard/ClientDashboardShell";
import { requireClient } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard — Venora",
  description: "Manage your saved venues and bookings on Venora.",
};

export default async function ClientDashboardPage() {
  const profile = await requireClient();
  return <ClientDashboardShell profile={profile} />;
}
