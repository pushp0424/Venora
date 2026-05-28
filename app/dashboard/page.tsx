import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Vendor Dashboard — Venora",
  description: "Manage your venues, bookings, and performance on Venora.",
};

export default function DashboardPage() {
  return <DashboardShell />;
}
