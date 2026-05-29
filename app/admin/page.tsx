import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import AdminSignInForm from "@/components/auth/AdminSignInForm";
import { getCurrentUserProfile } from "@/lib/auth";
import { ADMIN_DASHBOARD_PATH, normalizeUserRole } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "Admin Sign In — Venora",
  description: "Sign in to the Venora administration console.",
};

type AdminLoginPageProps = {
  searchParams: Promise<{ redirectTo?: string }>;
};

function AdminUnauthorized() {
  return (
    <div className="rounded-3xl border border-amber-400/30 bg-amber-950/30 p-8 text-center">
      <p className="text-lg font-semibold text-amber-100">Unauthorized</p>
      <p className="mt-2 text-sm text-amber-100/70">
        This sign-in page is for administrators only. Use the standard sign-in
        for client or host accounts.
      </p>
    </div>
  );
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirectTo ?? "";
  const profile = await getCurrentUserProfile();

  if (profile) {
    const role = normalizeUserRole(profile.role);
    if (role === "admin") {
      redirect(
        redirectTo && redirectTo.startsWith("/admin/") && redirectTo !== "/admin"
          ? redirectTo
          : ADMIN_DASHBOARD_PATH
      );
    }
    return (
      <AuthShell
        title="Administration"
        subtitle="Restricted access for Venora platform administrators."
        footer={null}
      >
        <AdminUnauthorized />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Administration"
      subtitle="Sign in with your administrator credentials."
      footer={null}
    >
      <AdminSignInForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
