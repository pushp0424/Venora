"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useVendorVenues } from "@/context/VendorVenuesContext";
import type { VendorVenue } from "@/data/dashboard";

const AMENITY_OPTIONS = [
  "WiFi",
  "Parking",
  "Catering",
  "AV Equipment",
  "Outdoor Space",
  "Wheelchair Accessible",
] as const;

type AddVenueFormData = {
  name: string;
  location: string;
  price: string;
  capacity: string;
  description: string;
  amenities: string[];
};

type AddVenueFormErrors = Partial<
  Record<keyof AddVenueFormData | "image", string>
>;

const initialFormData: AddVenueFormData = {
  name: "",
  location: "",
  price: "",
  capacity: "",
  description: "",
  amenities: [],
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validateForm(
  data: AddVenueFormData,
  imageFile: File | null
): AddVenueFormErrors {
  const errors: AddVenueFormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Venue name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Venue name must be at least 2 characters";
  }

  if (!data.location.trim()) {
    errors.location = "Location is required";
  }

  if (!data.price.trim()) {
    errors.price = "Price is required";
  } else if (!/^\$?\d+(\.\d{1,2})?$/.test(data.price.trim().replace(/,/g, ""))) {
    errors.price = "Enter a valid price (e.g. 2400 or $2,400)";
  }

  const capacity = Number(data.capacity);
  if (!data.capacity.trim()) {
    errors.capacity = "Capacity is required";
  } else if (!Number.isInteger(capacity) || capacity < 1) {
    errors.capacity = "Enter a valid guest capacity";
  }

  if (!data.description.trim()) {
    errors.description = "Description is required";
  } else if (data.description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters";
  }

  if (data.amenities.length === 0) {
    errors.amenities = "Select at least one amenity";
  }

  if (!imageFile) {
    errors.image = "Venue image is required";
  } else if (!imageFile.type.startsWith("image/")) {
    errors.image = "File must be an image";
  } else if (imageFile.size > MAX_IMAGE_SIZE) {
    errors.image = "Image must be under 5MB";
  }

  return errors;
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-neutral-200 focus:border-neutral-400 focus:ring-neutral-200"
  }`;
}

export default function AddVenueForm() {
  const router = useRouter();
  const { addVenue, setSuccessMessage } = useVendorVenues();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<AddVenueFormData>(initialFormData);
  const [errors, setErrors] = useState<AddVenueFormErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof AddVenueFormData>(
    field: K,
    value: AddVenueFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageFile = (file: File | null) => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const toggleAmenity = (amenity: string) => {
    const next = formData.amenities.includes(amenity)
      ? formData.amenities.filter((a) => a !== amenity)
      : [...formData.amenities, amenity];
    updateField("amenities", next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData, imageFile);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newVenue: VendorVenue = {
      id: `${slugify(formData.name)}-${Date.now()}`,
      name: formData.name.trim(),
      location: formData.location.trim(),
      status: "Active",
      bookings: 0,
      revenue: "$0",
      image: imagePreview!,
    };

    addVenue(newVenue);
    setSuccessMessage(
      `${formData.name.trim()} was added to your venues successfully.`
    );
    router.push("/host/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-3xl">
      <Link
        href="/host/dashboard"
        className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <span aria-hidden>←</span>
        Back to dashboard
      </Link>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Venue details</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Fill in the information below to list your space on Venora.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Venue name" error={errors.name} required>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={inputClass(!!errors.name)}
                placeholder="The Glass Pavilion"
              />
            </FormField>

            <FormField label="Location" error={errors.location} required>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                className={inputClass(!!errors.location)}
                placeholder="Manhattan, New York"
              />
            </FormField>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Price per event" error={errors.price} required>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => updateField("price", e.target.value)}
                className={inputClass(!!errors.price)}
                placeholder="$2,400"
              />
            </FormField>

            <FormField label="Capacity (guests)" error={errors.capacity} required>
              <input
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(e) => updateField("capacity", e.target.value)}
                className={inputClass(!!errors.capacity)}
                placeholder="180"
              />
            </FormField>
          </div>

          <FormField label="Description" error={errors.description} required>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              className={`${inputClass(!!errors.description)} resize-none`}
              placeholder="Describe your venue, atmosphere, and ideal event types..."
            />
          </FormField>

          <FormField label="Amenities" error={errors.amenities} required>
            <div className="grid gap-3 sm:grid-cols-2">
              {AMENITY_OPTIONS.map((amenity) => (
                <label
                  key={amenity}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    formData.amenities.includes(amenity)
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="sr-only"
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </FormField>

          <FormField label="Venue image" error={errors.image} required>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleImageFile(file);
              }}
              className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
                isDragging
                  ? "border-neutral-900 bg-neutral-50"
                  : errors.image
                    ? "border-red-300 bg-red-50/30"
                    : "border-neutral-200 bg-neutral-50"
              }`}
            >
              {imagePreview ? (
                <div className="relative aspect-[16/10]">
                  <Image
                    src={imagePreview}
                    alt="Venue preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleImageFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-900 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center px-6 py-12 text-center"
                >
                  <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                  <p className="mt-4 text-sm font-medium text-neutral-900">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    PNG, JPG up to 5MB
                  </p>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleImageFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </FormField>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-neutral-100 pt-8 sm:flex-row sm:justify-end">
          <Link
            href="/host/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit venue"}
          </button>
        </div>
      </div>
    </form>
  );
}

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700">
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
