import type { Metadata } from "next";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminSidebarNav } from "@/data/adminDashboard";
import { adminGetContentBlocks } from "@/lib/admin/content";
import { requireAdmin } from "@/lib/auth";
import { updateContentAction } from "@/app/admin/content/actions";

export const metadata: Metadata = {
  title: "Content — Venora Admin",
};

export default async function AdminContentPage() {
  const profile = await requireAdmin();
  const { data: blocks, error } = await adminGetContentBlocks();

  const initial =
    profile.fullName?.charAt(0)?.toUpperCase() ??
    profile.email.charAt(0).toUpperCase();

  return (
    <DashboardLayout
      title="Content management"
      subtitle="Edit marketing copy and site content blocks"
      activePath="/admin/content"
      dashboardRoot="/admin/dashboard"
      navItems={adminSidebarNav}
      userInitial={initial}
    >
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <div className="space-y-6">
          {blocks.map((block) => (
            <form
              key={block.id}
              action={updateContentAction}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <input type="hidden" name="id" value={block.id} />
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                {block.slug}
              </p>
              <label className="mt-3 block text-sm font-medium">Title</label>
              <input
                name="title"
                defaultValue={block.title}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm"
              />
              <label className="mt-4 block text-sm font-medium">Body</label>
              <textarea
                name="body"
                rows={4}
                defaultValue={block.body}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm"
              />
              <button
                type="submit"
                className="mt-4 rounded-full bg-neutral-950 px-5 py-2 text-sm font-semibold text-white"
              >
                Save
              </button>
            </form>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
