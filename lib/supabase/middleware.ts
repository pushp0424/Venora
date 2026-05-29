import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/data/user";
import {
  getDashboardPathForRole,
  isAdminLoginPath,
  isAdminProtectedPath,
  isProtectedDashboardPath,
  isRoleAllowedOnPath,
  normalizeUserRole,
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
  const isAdminLogin = isAdminLoginPath(pathname);
  const isAdminProtected = isAdminProtectedPath(pathname);
  const isProtected =
    isProtectedDashboardPath(pathname) || isAdminProtected;

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    if (isAdminProtected) {
      redirectUrl.pathname = "/admin";
    } else {
      redirectUrl.pathname = "/sign-in";
    }
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (!user && isAdminLogin) {
    return response;
  }

  if (user && (isProtected || isAuthRoute || isAdminLogin)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.role) {
      if (isProtected) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = isAdminProtected ? "/admin" : "/sign-in";
        redirectUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(redirectUrl);
      }
      if (isAdminLogin) {
        return response;
      }
      return response;
    }

    const role = normalizeUserRole(profile.role as UserRole);
    const dashboardPath = getDashboardPathForRole(role);

    if (isAdminLogin) {
      if (role === "admin") {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = dashboardPath;
        redirectUrl.search = "";
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    if (isAuthRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = dashboardPath;
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    if (isAdminProtected && role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = dashboardPath;
      return NextResponse.redirect(redirectUrl);
    }

    if (
      !isAdminProtected &&
      !isRoleAllowedOnPath(pathname, role) &&
      pathname !== dashboardPath
    ) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = dashboardPath;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}
