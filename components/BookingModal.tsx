"use client";

import { useEffect, useState } from "react";

type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  specialRequests: string;
};

type BookingFormErrors = Partial<Record<keyof BookingFormData, string>>;

const initialFormData: BookingFormData = {
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  guestCount: "",
  specialRequests: "",
};

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  venueName: string;
  venuePrice: string;
  maxGuests?: number;
};

function validateForm(
  data: BookingFormData,
  maxGuests?: number
): BookingFormErrors {
  const errors: BookingFormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[\d\s\-+()]{7,20}$/.test(data.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }

  if (!data.eventDate) {
    errors.eventDate = "Event date is required";
  } else {
    const selected = new Date(data.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      errors.eventDate = "Event date must be today or in the future";
    }
  }

  const guests = Number(data.guestCount);
  if (!data.guestCount.trim()) {
    errors.guestCount = "Guest count is required";
  } else if (!Number.isInteger(guests) || guests < 1) {
    errors.guestCount = "Enter a valid guest count";
  } else if (maxGuests && guests > maxGuests) {
    errors.guestCount = `Maximum capacity is ${maxGuests} guests`;
  }

  return errors;
}

export default function BookingModal({
  isOpen,
  onClose,
  venueName,
  venuePrice,
  maxGuests,
}: BookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
      setErrors({});
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData, maxGuests);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close booking modal"
      />

      <div className="relative z-10 flex max-h-[95vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
              Reserve venue
            </p>
            <h2
              id="booking-modal-title"
              className="mt-1 text-lg font-semibold tracking-tight text-neutral-900"
            >
              {venueName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          {isSubmitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white">
                <CheckIcon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-neutral-900">
                Booking request received
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                Thank you, {formData.name.split(" ")[0]}. Our team will confirm
                your reservation for {venueName} within 24 hours.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-8 w-full rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-neutral-700"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-neutral-500">
                Starting from{" "}
                <span className="font-semibold text-neutral-900">{venuePrice}</span>{" "}
                / event
              </p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <FormField
                  id="booking-name"
                  label="Full name"
                  error={errors.name}
                  required
                >
                  <input
                    id="booking-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={inputClass(!!errors.name)}
                    placeholder="Jane Smith"
                    autoComplete="name"
                  />
                </FormField>

                <FormField
                  id="booking-email"
                  label="Email"
                  error={errors.email}
                  required
                >
                  <input
                    id="booking-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={inputClass(!!errors.email)}
                    placeholder="jane@example.com"
                    autoComplete="email"
                  />
                </FormField>

                <FormField
                  id="booking-phone"
                  label="Phone"
                  error={errors.phone}
                  required
                >
                  <input
                    id="booking-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={inputClass(!!errors.phone)}
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                  />
                </FormField>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="booking-date"
                    label="Event date"
                    error={errors.eventDate}
                    required
                  >
                    <input
                      id="booking-date"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => updateField("eventDate", e.target.value)}
                      className={inputClass(!!errors.eventDate)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </FormField>

                  <FormField
                    id="booking-guests"
                    label="Guest count"
                    error={errors.guestCount}
                    required
                  >
                    <input
                      id="booking-guests"
                      type="number"
                      min={1}
                      max={maxGuests}
                      value={formData.guestCount}
                      onChange={(e) => updateField("guestCount", e.target.value)}
                      className={inputClass(!!errors.guestCount)}
                      placeholder={maxGuests ? `Up to ${maxGuests}` : "120"}
                    />
                  </FormField>
                </div>

                <FormField
                  id="booking-requests"
                  label="Special requests"
                  error={errors.specialRequests}
                >
                  <textarea
                    id="booking-requests"
                    rows={3}
                    value={formData.specialRequests}
                    onChange={(e) =>
                      updateField("specialRequests", e.target.value)
                    }
                    className={`${inputClass(false)} resize-none`}
                    placeholder="Dietary needs, setup preferences, accessibility..."
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Confirm booking request"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-neutral-200 focus:border-neutral-400 focus:ring-neutral-200"
  }`;
}

function FormField({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-neutral-700">
        {label}
        {required ? <span className="text-neutral-400"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-9" />
    </svg>
  );
}
