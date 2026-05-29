"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction } from "@/app/auth/actions";
import { authInitialState } from "@/app/auth/state";
import type { SignupRole } from "@/data/user";

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/20"
      : "border-white/15 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20"
  }`;
}

function RoleOption({
  value,
  label,
  description,
  defaultChecked,
}: {
  value: SignupRole;
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/15 bg-black/20 p-4 transition-colors has-[:checked]:border-[#D4AF37]/50 has-[:checked]:bg-[#D4AF37]/10">
      <input
        type="radio"
        name="role"
        value={value}
        defaultChecked={defaultChecked}
        className="mt-1 h-4 w-4 border-white/30 bg-transparent text-[#D4AF37] focus:ring-[#D4AF37]/30"
      />
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="mt-0.5 block text-xs text-white/55">{description}</span>
      </span>
    </label>
  );
}

type SignUpFormProps = {
  defaultRole?: SignupRole;
};

export default function SignUpForm({ defaultRole = "client" }: SignUpFormProps) {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    authInitialState
  );
  const fieldErrors = state?.fieldErrors ?? {};
  const formError = state?.error ?? null;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {formError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-200"
        >
          {formError}
        </div>
      ) : null}

      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-white/90">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          disabled={isPending}
          className={inputClass(Boolean(fieldErrors.fullName))}
          placeholder="Jordan Lee"
        />
        {fieldErrors.fullName ? (
          <p className="mt-1.5 text-sm text-red-300">{fieldErrors.fullName}</p>
        ) : null}
      </div>

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
          autoComplete="new-password"
          disabled={isPending}
          className={inputClass(Boolean(fieldErrors.password))}
          placeholder="At least 8 characters"
        />
        {fieldErrors.password ? (
          <p className="mt-1.5 text-sm text-red-300">{fieldErrors.password}</p>
        ) : null}
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-1 text-sm font-medium text-white/90">
          I am joining as a
        </legend>
        <RoleOption
          value="client"
          label="Client"
          description="Discover and book premium venues for your events."
          defaultChecked={defaultRole === "client"}
        />
        <RoleOption
          value="host"
          label="Host"
          description="List venues and manage booking requests on Venora."
          defaultChecked={defaultRole === "host"}
        />
        {fieldErrors.role ? (
          <p className="text-sm text-red-300">{fieldErrors.role}</p>
        ) : null}
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[#D4AF37] py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#e0c04a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

export function SignUpFooter() {
  return (
    <>
      Already have an account?{" "}
      <Link href="/sign-in" className="font-medium text-[#D4AF37] hover:underline">
        Sign in
      </Link>
    </>
  );
}
