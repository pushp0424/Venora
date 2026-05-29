"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction } from "@/app/auth/actions";
import { authInitialState } from "@/app/auth/state";

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/20"
      : "border-white/15 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20"
  }`;
}

type SignInFormProps = {
  redirectTo?: string;
};

export default function SignInForm({ redirectTo }: SignInFormProps) {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    authInitialState
  );
  const fieldErrors = state?.fieldErrors ?? {};
  const formError = state?.error ?? null;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {redirectTo ? (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      ) : null}
      {formError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-200"
        >
          {formError}
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/90">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          disabled={isPending}
          className={inputClass(Boolean(fieldErrors.email))}
          placeholder="you@email.com"
        />
        {fieldErrors.email ? (
          <p className="mt-1.5 text-sm text-red-300">{fieldErrors.email}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/90">
          Password
        </label>
        <input
          id="password"
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

export function SignInFooter() {
  return (
    <>
      New to Venora?{" "}
      <Link href="/sign-up" className="font-medium text-[#D4AF37] hover:underline">
        Create an account
      </Link>
    </>
  );
}
