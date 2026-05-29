"use server";

import { redirect } from "next/navigation";
import type { AuthActionState } from "@/app/auth/types";
import { ADMIN_DASHBOARD_PATH, normalizeUserRole } from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase";

function validateSignIn(email: string, password: string) {
  const fieldErrors: Record<string, string> = {};

  if (!email.trim()) {
    fieldErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    fieldErrors.email = "Enter a valid email address";
  }

  if (!password) {
    fieldErrors.password = "Password is required";
  } else if (password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters";
  }

  return fieldErrors;
}

export async function adminSignInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "").trim();

  const fieldErrors = validateSignIn(email, password);
  if (Object.keys(fieldErrors).length > 0) {
    return { error: null, fieldErrors };
  }

  if (!isSupabaseConfigured()) {
    return {
      error: "Authentication is not configured. Contact support.",
      fieldErrors: {},
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message || "Invalid email or password.",
      fieldErrors: {},
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  const role = normalizeUserRole(profile?.role);

  if (role !== "admin") {
    await supabase.auth.signOut();
    return {
      error: "Unauthorized",
      fieldErrors: {},
    };
  }

  if (
    redirectTo &&
    redirectTo.startsWith("/admin/") &&
    redirectTo !== "/admin"
  ) {
    redirect(redirectTo);
  }

  redirect(ADMIN_DASHBOARD_PATH);
}
