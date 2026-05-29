"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { VenueInput, VenueStatus } from "@/data/venues";
import {
  adminCreateVenue,
  adminDeleteVenue,
  adminSetVenueStatus,
  adminUpdateVenue,
} from "@/lib/admin/venues";
import { requireAdmin } from "@/lib/auth";

function parseVenueFormData(formData: FormData): VenueInput {
  const priceAmount = Number(formData.get("priceAmount"));
  const capacityMax = Number(formData.get("capacityMax"));

  return {
    id: String(formData.get("id") ?? "").trim() || undefined,
    name: String(formData.get("name") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    priceAmount: Number.isFinite(priceAmount) ? priceAmount : 0,
    rating: String(formData.get("rating") ?? "4.8").trim(),
    image: String(formData.get("image") ?? "").trim(),
    tag: String(formData.get("tag") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    capacity: String(formData.get("capacity") ?? "").trim(),
    capacityMax: Number.isFinite(capacityMax) ? capacityMax : 0,
    status: String(formData.get("status") ?? "pending") as VenueStatus,
    availability: String(formData.get("availability") ?? "available") as VenueInput["availability"],
  };
}

export async function createVenueAction(formData: FormData) {
  await requireAdmin();
  const input = parseVenueFormData(formData);
  const id =
    input.id ??
    input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const { error } = await adminCreateVenue({ ...input, id });
  if (error) {
    throw new Error(error);
  }

  revalidatePath("/admin/venues");
  redirect("/admin/venues");
}

export async function updateVenueAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const input = parseVenueFormData(formData);

  const { error } = await adminUpdateVenue(id, { ...input, id });
  if (error) {
    throw new Error(error);
  }

  revalidatePath("/admin/venues");
  revalidatePath(`/admin/venues/${id}/edit`);
  redirect("/admin/venues");
}

export async function deleteVenueAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await adminDeleteVenue(id);
  if (error) {
    throw new Error(error);
  }
  revalidatePath("/admin/venues");
}

export async function setVenueStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as VenueStatus;
  const { error } = await adminSetVenueStatus(id, status);
  if (error) {
    throw new Error(error);
  }
  revalidatePath("/admin/venues");
}
