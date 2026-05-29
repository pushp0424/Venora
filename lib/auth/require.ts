import { redirect } from "next/navigation";
import type { UserProfile, UserRole } from "@/data/user";
import { getCurrentUserProfile } from "@/lib/auth";
import { getDashboardPathForRole } from "@/lib/auth/roles";

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

  if (!allowed.includes(profile.role)) {
    redirect(getDashboardPathForRole(profile.role));
  }

  return profile;
}

export async function requireAdmin(): Promise<UserProfile> {
  return requireRole(["admin"], "/admin");
}

export async function requireHost(): Promise<UserProfile> {
  return requireRole(["host"], "/host/dashboard");
}

export async function requireClient(): Promise<UserProfile> {
  return requireRole(["client"], "/dashboard");
}
