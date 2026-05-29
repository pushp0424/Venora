import { adminGetAllBookings } from "@/lib/admin/bookings";
import { adminGetAllVenues } from "@/lib/admin/venues";
import { adminGetHostLeads, adminGetHosts } from "@/lib/admin/hosts";

export type PlatformAnalytics = {
  totalVenues: number;
  pendingVenues: number;
  approvedVenues: number;
  totalHosts: number;
  pendingHostApplications: number;
  totalBookings: number;
  confirmedBookings: number;
};

export async function adminGetPlatformAnalytics(): Promise<{
  data: PlatformAnalytics | null;
  error: string | null;
}> {
  const [venues, hosts, leads, bookings] = await Promise.all([
    adminGetAllVenues(),
    adminGetHosts(),
    adminGetHostLeads(),
    adminGetAllBookings(),
  ]);

  if (venues.error || hosts.error || leads.error || bookings.error) {
    return {
      data: null,
      error:
        venues.error ??
        hosts.error ??
        leads.error ??
        bookings.error ??
        "Unable to load analytics.",
    };
  }

  return {
    data: {
      totalVenues: venues.data.length,
      pendingVenues: venues.data.filter((v) => v.status === "pending").length,
      approvedVenues: venues.data.filter((v) => v.status === "approved").length,
      totalHosts: hosts.data.length,
      pendingHostApplications: leads.data.filter((l) => l.status === "pending")
        .length,
      totalBookings: bookings.data.length,
      confirmedBookings: bookings.data.filter((b) => b.status === "confirmed")
        .length,
    },
    error: null,
  };
}
