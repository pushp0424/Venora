import type { UserRole, UserProfile } from "@/data/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase";

import { normalizeUserRole } from "@/lib/auth/roles";

export {
  getDashboardPathForRole,
  isRoleAllowedOnPath,
  isProtectedDashboardPath,
  isAdminPath,
  isAdminLoginPath,
  isAdminProtectedPath,
  isHostPath,
  isClientPath,
  normalizeUserRole,
} from "@/lib/auth/roles";

export {
  requireAuth,
  requireRole,
  requireAdmin,
  requireHost,
  requireClient,
} from "@/lib/auth/require";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: normalizeUserRole(row.role),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at, updated_at")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapProfile(data as ProfileRow);
  } catch {
    return null;
  }
}

export async function getProfileByUserId(
  userId: string
): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at, updated_at")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapProfile(data as ProfileRow);
  } catch {
    return null;
  }
}
