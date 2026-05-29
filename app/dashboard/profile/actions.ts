"use server";

import { revalidatePath } from "next/cache";
import { requireClient } from "@/lib/auth";
import { updateProfileFullName } from "@/lib/profiles";

export type ProfileActionState = {
  error: string | null;
  success: boolean;
};

export async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const profile = await requireClient();
  const fullName = String(formData.get("fullName") ?? "").trim();

  if (!fullName || fullName.length < 2) {
    return {
      error: "Full name must be at least 2 characters.",
      success: false,
    };
  }

  const { error } = await updateProfileFullName(profile.id, fullName);

  if (error) {
    return { error, success: false };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");

  return { error: null, success: true };
}
