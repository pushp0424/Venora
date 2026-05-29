import type { Metadata } from "next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminSidebarNav } from "@/data/adminDashboard";
import { adminGetHostLeads, adminGetHosts } from "@/lib/admin/hosts";
import { requireAdmin } from "@/lib/auth";
import { setHostLeadStatusAction } from "@/app/admin/hosts/actions";

export const metadata: Metadata = {
  title: "Hosts — Venora Admin",
};

export default async function AdminHostsPage() {
  const profile = await requireAdmin();
  const [{ data: hosts, error: hostsError }, { data: leads, error: leadsError }] =
    await Promise.all([adminGetHosts(), adminGetHostLeads()]);

  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="Hosts"
      subtitle="Registered hosts and pending applications"
      activePath="/admin/hosts"
      dashboardRoot="/admin"
      navItems={adminSidebarNav}
      userInitial={initial}
    >
      <section>
        <h2 className="text-lg font-semibold tracking-tight">Registered hosts</h2>
        {hostsError ? (
          <p className="mt-2 text-sm text-red-600">{hostsError}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {hosts.map((host) => (
              <li
                key={host.id}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm"
              >
                <p className="font-medium">{host.fullName ?? host.email}</p>
                <p className="text-neutral-500">{host.email}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Host applications</h2>
        {leadsError ? (
          <p className="mt-2 text-sm text-red-600">{leadsError}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold">{lead.fullName}</p>
                    <p className="text-sm text-neutral-500">{lead.email}</p>
                    <p className="mt-2 text-sm">
                      {lead.venueName} · {lead.city} · {lead.venueType} ·{" "}
                      {lead.capacity} guests
                    </p>
                    {lead.message ? (
                      <p className="mt-2 text-sm text-neutral-600">{lead.message}</p>
                    ) : null}
                  </div>
                  <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize">
                    {lead.status}
                  </span>
                </div>
                {lead.status === "pending" ? (
                  <div className="mt-4 flex gap-2">
                    <form action={setHostLeadStatusAction}>
                      <input type="hidden" name="id" value={lead.id} />
                      <input type="hidden" name="status" value="approved" />
                      <button
                        type="submit"
                        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={setHostLeadStatusAction}>
                      <input type="hidden" name="id" value={lead.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <button
                        type="submit"
                        className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
