import type { SignupRole } from "@/data/user";

export type AuthActionState = {
  error: string | null;
  fieldErrors: Record<string, string>;
};

export type SignUpPayload = {
  fullName: string;
  email: string;
  password: string;
  role: SignupRole;
};
