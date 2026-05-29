"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/dashboard/profile/actions";
import { profileInitialState } from "@/app/dashboard/profile/state";
import type { UserProfile } from "@/data/user";

type ProfileFormProps = {
  profile: UserProfile;
};

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    profileInitialState
  );

  return (
    <form action={formAction} className="mx-auto max-w-lg space-y-5">
      {state?.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Profile updated successfully.
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          value={profile.email}
          disabled
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500"
        />
      </div>

      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          defaultValue={profile.fullName ?? ""}
          disabled={isPending}
          className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Account type</label>
        <input
          value="Client"
          disabled
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm capitalize text-neutral-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-neutral-950 px-8 py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
