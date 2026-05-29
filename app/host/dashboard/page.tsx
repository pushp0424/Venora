import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Host Dashboard — Venora",
  description: "Manage your venues, booking requests, and performance on Venora.",
};

export default function HostDashboardPage() {
  return <DashboardShell />;
}
