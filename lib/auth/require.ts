import { redirect } from "next/navigation";
import type { UserProfile, UserRole } from "@/data/user";
import { getCurrentUserProfile } from "@/lib/auth";
import {
  getDashboardPathForRole,
  normalizeUserRole,
} from "@/lib/auth/roles";

export async function requireAuth(redirectTo: string): Promise<UserProfile> {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect(`/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return profile;
}

export async function requireRole(
  allowed: UserRole[],
  redirectTo: string
): Promise<UserProfile> {
  const profile = await requireAuth(redirectTo);

  const role = normalizeUserRole(profile.role);
  if (!allowed.includes(role)) {
    redirect(getDashboardPathForRole(role));
  }

  return profile;
}

export async function requireAdmin(): Promise<UserProfile> {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect(
      `/admin?redirectTo=${encodeURIComponent("/admin/dashboard")}`
    );
  }

  const role = normalizeUserRole(profile.role);
  if (role !== "admin") {
    redirect(getDashboardPathForRole(role));
  }

  return profile;
}

export async function requireHost(): Promise<UserProfile> {
  return requireRole(["host"], "/host/dashboard");
}

export async function requireClient(): Promise<UserProfile> {
  return requireRole(["client"], "/dashboard");
}
