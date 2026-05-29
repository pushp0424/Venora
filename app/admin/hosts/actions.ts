"use server";

import { revalidatePath } from "next/cache";
import { adminSetHostLeadStatus } from "@/lib/admin/hosts";
import { requireAdmin } from "@/lib/auth";

export async function setHostLeadStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as "approved" | "rejected";

  const { error } = await adminSetHostLeadStatus(id, status);
  if (error) {
    throw new Error(error);
  }

  revalidatePath("/admin/hosts");
}
