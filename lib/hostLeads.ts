import type { HostLeadInput, HostVenueType } from "@/data/hostLead";
import { HOST_VENUE_TYPES } from "@/data/hostLead";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export type HostLeadFormErrors = Partial<
  Record<keyof HostLeadInput | "form", string>
>;

export type HostLeadSubmitResult = {
  success: boolean;
  error: string | null;
  fieldErrors: HostLeadFormErrors;
};

export function validateHostLeadInput(
  input: HostLeadInput
): HostLeadFormErrors {
  const errors: HostLeadFormErrors = {};

  if (!input.fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (input.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters";
  }

  if (!input.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!input.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[\d\s\-+()]{7,20}$/.test(input.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }

  if (!input.venueName.trim()) {
    errors.venueName = "Venue name is required";
  } else if (input.venueName.trim().length < 2) {
    errors.venueName = "Venue name must be at least 2 characters";
  }

  if (!input.city.trim()) {
    errors.city = "City is required";
  }

  if (!input.venueType) {
    errors.venueType = "Venue type is required";
  } else if (!HOST_VENUE_TYPES.includes(input.venueType)) {
    errors.venueType = "Select a valid venue type";
  }

  const capacity = Number(input.capacity);
  if (!Number.isInteger(capacity) || capacity < 1) {
    errors.capacity = "Enter a valid capacity (minimum 1 guest)";
  } else if (capacity > 100000) {
    errors.capacity = "Capacity must be 100,000 or fewer";
  }

  if (input.message && input.message.trim().length > 2000) {
    errors.message = "Message must be 2,000 characters or fewer";
  }

  return errors;
}

function parseHostLeadFormData(formData: FormData): HostLeadInput {
  const venueType = formData.get("venueType") as HostVenueType;

  return {
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    venueName: String(formData.get("venueName") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    venueType,
    capacity: Number(formData.get("capacity")),
    message: String(formData.get("message") ?? "").trim() || undefined,
  };
}

export async function submitHostLeadFromForm(
  formData: FormData
): Promise<HostLeadSubmitResult> {
  const input = parseHostLeadFormData(formData);
  const fieldErrors = validateHostLeadInput(input);

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: null, fieldErrors };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error:
        "Host registration is temporarily unavailable. Please try again later.",
      fieldErrors: {},
    };
  }

  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("host_leads").insert({
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      venue_name: input.venueName,
      city: input.city,
      venue_type: input.venueType,
      capacity: input.capacity,
      message: input.message ?? null,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Unable to submit your application.",
        fieldErrors: {},
      };
    }

    return { success: true, error: null, fieldErrors: {} };
  } catch {
    return {
      success: false,
      error: "Unable to submit your application. Please try again later.",
      fieldErrors: {},
    };
  }
}

