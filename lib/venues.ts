import type { Venue } from "@/data/venues";
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export type VenuesResult = {
  data: Venue[];
  error: string | null;
};

type VenueRow = {
  id: string;
  name: string;
  city: string;
  location: string;
  price: string;
  price_amount: number;
  rating: string;
  image: string;
  tag: string;
  description: string;
  capacity: string;
  capacity_max: number;
};

function mapRowToVenue(row: VenueRow): Venue {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    location: row.location,
    price: row.price,
    priceAmount: row.price_amount,
    rating: row.rating,
    image: row.image,
    tag: row.tag,
    description: row.description,
    capacity: row.capacity,
    capacityMax: row.capacity_max,
  };
}

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
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapRowToVenue(data as VenueRow);
  } catch {
    return null;
  }
}
