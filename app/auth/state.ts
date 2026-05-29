import type { AuthActionState } from "@/app/auth/types";

export const authInitialState: AuthActionState = {
  error: null,
  fieldErrors: {},
};
