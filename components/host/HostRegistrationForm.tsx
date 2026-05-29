"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitHostRegistrationAction } from "@/app/become-a-host/actions";
import { hostRegistrationInitialState } from "@/app/become-a-host/state";
import { HOST_VENUE_TYPES } from "@/data/hostLead";

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-neutral-200 focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/15"
  }`;
}

function labelClass() {
  return "mb-1.5 block text-sm font-medium text-neutral-800";
}

export default function HostRegistrationForm() {
  const [state, formAction, isPending] = useActionState(
    submitHostRegistrationAction,
    hostRegistrationInitialState
  );

  const fieldErrors = state?.fieldErrors ?? {};
  const formError = state?.error ?? null;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {formError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {formError}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className={labelClass()}>
            Full Name <span className="text-[#D4AF37]">*</span>
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
            <p className="mt-1.5 text-sm text-red-600">{fieldErrors.fullName}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={labelClass()}>
            Email <span className="text-[#D4AF37]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            disabled={isPending}
            className={inputClass(Boolean(fieldErrors.email))}
            placeholder="you@venue.com"
          />
          {fieldErrors.email ? (
            <p className="mt-1.5 text-sm text-red-600">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass()}>
            Phone Number <span className="text-[#D4AF37]">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            disabled={isPending}
            className={inputClass(Boolean(fieldErrors.phone))}
            placeholder="+1 (555) 000-0000"
          />
          {fieldErrors.phone ? (
            <p className="mt-1.5 text-sm text-red-600">{fieldErrors.phone}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="venueName" className={labelClass()}>
            Venue Name <span className="text-[#D4AF37]">*</span>
          </label>
          <input
            id="venueName"
            name="venueName"
            type="text"
            disabled={isPending}
            className={inputClass(Boolean(fieldErrors.venueName))}
            placeholder="The Grand Atelier"
          />
          {fieldErrors.venueName ? (
            <p className="mt-1.5 text-sm text-red-600">{fieldErrors.venueName}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="city" className={labelClass()}>
            City <span className="text-[#D4AF37]">*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            disabled={isPending}
            className={inputClass(Boolean(fieldErrors.city))}
            placeholder="New York"
          />
          {fieldErrors.city ? (
            <p className="mt-1.5 text-sm text-red-600">{fieldErrors.city}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="venueType" className={labelClass()}>
            Venue Type <span className="text-[#D4AF37]">*</span>
          </label>
          <select
            id="venueType"
            name="venueType"
            defaultValue=""
            disabled={isPending}
            className={inputClass(Boolean(fieldErrors.venueType))}
          >
            <option value="" disabled>
              Select venue type
            </option>
            {HOST_VENUE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {fieldErrors.venueType ? (
            <p className="mt-1.5 text-sm text-red-600">{fieldErrors.venueType}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="capacity" className={labelClass()}>
            Capacity <span className="text-[#D4AF37]">*</span>
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            disabled={isPending}
            className={inputClass(Boolean(fieldErrors.capacity))}
            placeholder="250"
          />
          {fieldErrors.capacity ? (
            <p className="mt-1.5 text-sm text-red-600">{fieldErrors.capacity}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass()}>
            Optional Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            disabled={isPending}
            className={`${inputClass(Boolean(fieldErrors.message))} resize-y`}
            placeholder="Tell us about your venue, amenities, or ideal events..."
          />
          {fieldErrors.message ? (
            <p className="mt-1.5 text-sm text-red-600">{fieldErrors.message}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">
          By submitting, you agree to be contacted by the Venora host team.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-semibold text-black transition-all hover:bg-[#e0c04a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Submitting…" : "Submit application"}
          </button>
        </div>
      </div>
    </form>
  );
}
