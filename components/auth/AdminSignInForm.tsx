"use client";

import { useActionState } from "react";
import { adminSignInAction } from "@/app/admin/actions";
import { authInitialState } from "@/app/auth/state";

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/20"
      : "border-white/15 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20"
  }`;
}

type AdminSignInFormProps = {
  redirectTo?: string;
};

export default function AdminSignInForm({ redirectTo }: AdminSignInFormProps) {
  const [state, formAction, isPending] = useActionState(
    adminSignInAction,
    authInitialState
  );
  const fieldErrors = state?.fieldErrors ?? {};
  const formError = state?.error ?? null;
  const isUnauthorized = formError === "Unauthorized";

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {redirectTo ? (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      ) : null}
      {formError ? (
        <div
          role="alert"
          className={`rounded-xl border px-4 py-3 text-sm ${
            isUnauthorized
              ? "border-amber-400/40 bg-amber-950/50 text-amber-100"
              : "border-red-400/30 bg-red-950/40 text-red-200"
          }`}
        >
          {formError}
        </div>
      ) : null}

      <div>
        <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-white/90">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          disabled={isPending}
          className={inputClass(Boolean(fieldErrors.email))}
          placeholder="admin@venue.com"
        />
        {fieldErrors.email ? (
          <p className="mt-1.5 text-sm text-red-300">{fieldErrors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-white/90">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          disabled={isPending}
          className={inputClass(Boolean(fieldErrors.password))}
          placeholder="••••••••"
        />
        {fieldErrors.password ? (
          <p className="mt-1.5 text-sm text-red-300">{fieldErrors.password}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[#D4AF37] py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#e0c04a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
