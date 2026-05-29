import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/data/user";
import {
  getDashboardPathForRole,
  isProtectedDashboardPath,
  isRoleAllowedOnPath,
} from "@/lib/auth/roles";
import { isSupabaseConfigured } from "@/lib/supabase";

const AUTH_PATHS = ["/sign-in", "/sign-up"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = AUTH_PATHS.some((path) => pathname.startsWith(path));
  const isProtected = isProtectedDashboardPath(pathname);

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (isProtected || isAuthRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = (profile?.role as UserRole | undefined) ?? "client";
    const dashboardPath = getDashboardPathForRole(role);

    if (isAuthRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = dashboardPath;
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    if (!isRoleAllowedOnPath(pathname, role)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = dashboardPath;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}
