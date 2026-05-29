"use server";

import { redirect } from "next/navigation";
import type { AuthActionState, SignUpPayload } from "@/app/auth/types";
import type { UserRole } from "@/data/user";
import { SIGNUP_ROLES } from "@/data/user";
import { getDashboardPathForRole } from "@/lib/auth";
import { isRoleAllowedOnPath } from "@/lib/auth/roles";
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

function validateSignUp(payload: SignUpPayload) {
  const fieldErrors: Record<string, string> = {};

  if (!payload.fullName.trim()) {
    fieldErrors.fullName = "Full name is required";
  } else if (payload.fullName.trim().length < 2) {
    fieldErrors.fullName = "Full name must be at least 2 characters";
  }

  if (!payload.email.trim()) {
    fieldErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    fieldErrors.email = "Enter a valid email address";
  }

  if (!payload.password) {
    fieldErrors.password = "Password is required";
  } else if (payload.password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters";
  }

  if (!SIGNUP_ROLES.includes(payload.role as (typeof SIGNUP_ROLES)[number])) {
    fieldErrors.role = "Select a valid account type";
  }

  return fieldErrors;
}

function parseSignUpFormData(formData: FormData): SignUpPayload {
  return {
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "client") as SignUpPayload["role"],
  };
}

export async function signInAction(
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

  const role = (profile?.role as UserRole | undefined) ?? "client";
  const defaultPath = getDashboardPathForRole(role);

  if (
    redirectTo &&
    redirectTo.startsWith("/") &&
    isRoleAllowedOnPath(redirectTo, role)
  ) {
    redirect(redirectTo);
  }

  redirect(defaultPath);
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const payload = parseSignUpFormData(formData);
  const fieldErrors = validateSignUp(payload);

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
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName,
        role: payload.role,
      },
    },
  });

  if (error) {
    return {
      error: error.message || "Unable to create your account.",
      fieldErrors: {},
    };
  }

  if (!data.user) {
    return {
      error: "Unable to create your account. Please try again.",
      fieldErrors: {},
    };
  }

  await supabase.from("profiles").upsert({
    id: data.user.id,
    email: payload.email,
    full_name: payload.fullName,
    role: payload.role,
  });

  redirect(getDashboardPathForRole(payload.role));
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
