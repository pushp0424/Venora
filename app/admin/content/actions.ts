"use server";

import { revalidatePath } from "next/cache";
import { adminUpdateContentBlock } from "@/lib/admin/content";
import { requireAdmin } from "@/lib/auth";

export async function updateContentAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  const { error } = await adminUpdateContentBlock(id, title, body);
  if (error) {
    throw new Error(error);
  }

  revalidatePath("/admin/content");
}
