import type { UserRole } from "@/data/user";

const CLIENT_PREFIX = "/dashboard";
const HOST_PREFIX = "/host/dashboard";
const ADMIN_PREFIX = "/admin";

export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return ADMIN_PREFIX;
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

export function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
}

export function isRoleAllowedOnPath(pathname: string, role: UserRole): boolean {
  if (isAdminPath(pathname)) return role === "admin";
  if (isHostPath(pathname)) return role === "host";
  if (isClientPath(pathname)) return role === "client";
  return false;
}

export function isProtectedDashboardPath(pathname: string): boolean {
  return isClientPath(pathname) || isHostPath(pathname) || isAdminPath(pathname);
}
