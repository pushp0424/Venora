import type { Venue, VenueInput } from "@/data/venues";
import { mapRowToVenue, mapVenueToRow, type VenueRow } from "@/lib/venues-map";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function hostGetOwnVenues(hostId: string): Promise<{
  data: Venue[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("host_id", hostId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data as VenueRow[]).map(mapRowToVenue), error: null };
}

export async function hostGetVenueById(
  hostId: string,
  venueId: string
): Promise<Venue | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("id", venueId)
    .eq("host_id", hostId)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToVenue(data as VenueRow);
}

export async function hostCreateVenue(
  hostId: string,
  input: VenueInput
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("venues").insert(
    mapVenueToRow(
      { ...input, status: "pending", hostId },
      hostId
    )
  );

  return { error: error?.message ?? null };
}

export async function hostUpdateVenue(
  hostId: string,
  venueId: string,
  input: VenueInput
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("venues")
    .update(mapVenueToRow({ ...input, hostId }, hostId))
    .eq("id", venueId)
    .eq("host_id", hostId);

  return { error: error?.message ?? null };
}

export async function hostGetVenueAnalytics(hostId: string): Promise<{
  data: { venueCount: number; pendingCount: number; approvedCount: number };
  error: string | null;
}> {
  const { data, error } = await hostGetOwnVenues(hostId);

  if (error) {
    return { data: { venueCount: 0, pendingCount: 0, approvedCount: 0 }, error };
  }

  return {
    data: {
      venueCount: data.length,
      pendingCount: data.filter((v) => v.status === "pending").length,
      approvedCount: data.filter((v) => v.status === "approved").length,
    },
    error: null,
  };
}
