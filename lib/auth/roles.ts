import { USER_ROLES, type UserRole } from "@/data/user";

const CLIENT_PREFIX = "/dashboard";
const HOST_PREFIX = "/host/dashboard";
const ADMIN_LOGIN_PATH = "/admin";
/** Default landing page after admin login. */
export const ADMIN_DASHBOARD_PATH = "/admin/dashboard";

/** Coerce DB/auth values to a known role (must match getDashboardPathForRole defaults). */
export function normalizeUserRole(role: string | null | undefined): UserRole {
  if (USER_ROLES.includes(role as UserRole)) {
    return role as UserRole;
  }
  return "client";
}

export function getDashboardPathForRole(
  role: UserRole | string | null | undefined
): string {
  switch (normalizeUserRole(role)) {
    case "admin":
      return ADMIN_DASHBOARD_PATH;
    case "host":
      return HOST_PREFIX;
    case "client":
      return CLIENT_PREFIX;
    default:
      return CLIENT_PREFIX;
  }
}

export function isClientPath(pathname: string): boolean {
  return pathname === CLIENT_PREFIX || pathname.startsWith(`${CLIENT_PREFIX}/`);
}

export function isHostPath(pathname: string): boolean {
  return pathname === HOST_PREFIX || pathname.startsWith(`${HOST_PREFIX}/`);
}

export function isAdminLoginPath(pathname: string): boolean {
  return pathname === ADMIN_LOGIN_PATH || pathname === `${ADMIN_LOGIN_PATH}/`;
}

/** /admin/dashboard, /admin/venues, … — not the bare /admin login page. */
export function isAdminProtectedPath(pathname: string): boolean {
  if (isAdminLoginPath(pathname)) return false;
  return pathname.startsWith(`${ADMIN_LOGIN_PATH}/`);
}

export function isAdminPath(pathname: string): boolean {
  return isAdminProtectedPath(pathname);
}

export function isRoleAllowedOnPath(
  pathname: string,
  role: UserRole | string | null | undefined
): boolean {
  const normalized = normalizeUserRole(role);
  if (isAdminProtectedPath(pathname)) return normalized === "admin";
  if (isHostPath(pathname)) return normalized === "host";
  if (isClientPath(pathname)) return normalized === "client";
  return false;
}

export function isProtectedDashboardPath(pathname: string): boolean {
  return (
    isClientPath(pathname) ||
    isHostPath(pathname) ||
    isAdminProtectedPath(pathname)
  );
}
