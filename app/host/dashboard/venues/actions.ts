"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { VenueInput } from "@/data/venues";
import { requireHost } from "@/lib/auth";
import { hostCreateVenue, hostUpdateVenue } from "@/lib/host/venues";

function parseVenueFormData(formData: FormData): VenueInput {
  const priceAmount = Number(formData.get("priceAmount"));
  const capacityMax = Number(formData.get("capacityMax"));

  return {
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
    availability: String(formData.get("availability") ?? "available") as VenueInput["availability"],
  };
}

export async function hostCreateVenueAction(formData: FormData) {
  const profile = await requireHost();
  const input = parseVenueFormData(formData);
  const id = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const { error } = await hostCreateVenue(profile.id, { ...input, id });
  if (error) {
    throw new Error(error);
  }

  revalidatePath("/host/dashboard/venues");
  redirect("/host/dashboard/venues");
}

export async function hostUpdateVenueAction(formData: FormData) {
  const profile = await requireHost();
  const venueId = String(formData.get("id") ?? "");
  const input = parseVenueFormData(formData);

  const { error } = await hostUpdateVenue(profile.id, venueId, {
    ...input,
    id: venueId,
  });
  if (error) {
    throw new Error(error);
  }

  revalidatePath("/host/dashboard/venues");
  redirect("/host/dashboard/venues");
}
