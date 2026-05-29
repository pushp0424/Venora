import type { Venue, VenueInput, VenueStatus } from "@/data/venues";
import { mapRowToVenue, mapVenueToRow, type VenueRow } from "@/lib/venues-map";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase";

export type AdminVenuesResult = {
  data: Venue[];
  error: string | null;
};

export async function adminGetAllVenues(): Promise<AdminVenuesResult> {
  if (!isSupabaseConfigured()) {
    return { data: [], error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data as VenueRow[]).map(mapRowToVenue), error: null };
}

export async function adminGetVenueById(id: string): Promise<Venue | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToVenue(data as VenueRow);
}

export async function adminCreateVenue(
  input: VenueInput
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("venues").insert(
    mapVenueToRow({ ...input, status: input.status ?? "approved" })
  );

  return { error: error?.message ?? null };
}

export async function adminUpdateVenue(
  id: string,
  input: VenueInput
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("venues")
    .update(mapVenueToRow(input))
    .eq("id", id);

  return { error: error?.message ?? null };
}

export async function adminDeleteVenue(
  id: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("venues").delete().eq("id", id);

  return { error: error?.message ?? null };
}

export async function adminSetVenueStatus(
  id: string,
  status: VenueStatus
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("venues")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  return { error: error?.message ?? null };
}
