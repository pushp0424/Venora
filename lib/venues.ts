import type { Venue } from "@/data/venues";
import { mapRowToVenue, type VenueRow } from "@/lib/venues-map";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export type VenuesResult = {
  data: Venue[];
  error: string | null;
};

export async function getVenues(): Promise<VenuesResult> {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      error:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
    };
  }

  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return {
      data: (data as VenueRow[]).map(mapRowToVenue),
      error: null,
    };
  } catch {
    return {
      data: [],
      error: "Unable to load venues. Please try again later.",
    };
  }
}

export async function getVenueById(id: string): Promise<Venue | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .eq("id", id)
      .eq("status", "approved")
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapRowToVenue(data as VenueRow);
  } catch {
    return null;
  }
}
