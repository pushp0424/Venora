"use server";

import { redirect } from "next/navigation";
import type { HostRegistrationActionState } from "@/app/become-a-host/types";
import { submitHostLeadFromForm } from "@/lib/hostLeads";

export async function submitHostRegistrationAction(
  _prevState: HostRegistrationActionState,
  formData: FormData
): Promise<HostRegistrationActionState> {
  const result = await submitHostLeadFromForm(formData);

  if (result.success) {
    redirect("/become-a-host/success");
  }

  if (Object.keys(result.fieldErrors).length > 0) {
    return {
      error: null,
      fieldErrors: result.fieldErrors as Record<string, string>,
    };
  }

  return {
    error: result.error ?? "Something went wrong. Please try again.",
    fieldErrors: {},
  };
}
