export const USER_ROLES = ["admin", "host", "client"] as const;

/** Roles available on public sign-up (admin is assigned manually). */
export const SIGNUP_ROLES = ["client", "host"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type SignupRole = (typeof SIGNUP_ROLES)[number];

export type UserProfile = {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};
