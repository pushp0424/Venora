import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase";

export type Booking = {
  id: string;
  venueId: string;
  venueName: string;
  clientId: string | null;
  clientName: string;
  hostId: string | null;
  eventDate: string;
  guests: number;
  status: "pending" | "confirmed" | "cancelled";
  amount: string;
  specialRequests: string | null;
  createdAt: string;
};

type BookingRow = {
  id: string;
  venue_id: string;
  venue_name: string;
  client_id: string | null;
  client_name: string;
  host_id: string | null;
  event_date: string;
  guests: number;
  status: string;
  amount: string;
  special_requests: string | null;
  created_at: string;
};

function mapBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    venueId: row.venue_id,
    venueName: row.venue_name,
    clientId: row.client_id,
    clientName: row.client_name,
    hostId: row.host_id,
    eventDate: row.event_date,
    guests: row.guests,
    status: row.status as Booking["status"],
    amount: row.amount,
    specialRequests: row.special_requests,
    createdAt: row.created_at,
  };
}

export async function adminGetAllBookings(): Promise<{
  data: Booking[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data as BookingRow[]).map(mapBooking), error: null };
}

export async function hostGetBookings(hostId: string): Promise<{
  data: Booking[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("host_id", hostId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data as BookingRow[]).map(mapBooking), error: null };
}

export async function clientGetBookings(clientId: string): Promise<{
  data: Booking[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data as BookingRow[]).map(mapBooking), error: null };
}
