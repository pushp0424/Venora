import type { UserProfile } from "@/data/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase";

export type HostLeadRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  venue_name: string;
  city: string;
  venue_type: string;
  capacity: number;
  message: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
};

export type HostLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  venueName: string;
  city: string;
  venueType: string;
  capacity: number;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt: string | null;
};

function mapHostLead(row: HostLeadRow): HostLead {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    venueName: row.venue_name,
    city: row.city,
    venueType: row.venue_type,
    capacity: row.capacity,
    message: row.message,
    status: row.status as HostLead["status"],
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
  };
}

export async function adminGetHosts(): Promise<{
  data: UserProfile[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, updated_at")
    .eq("role", "host")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return {
    data: (data ?? []).map((row) => ({
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      role: "host" as const,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
    error: null,
  };
}

export async function adminGetHostLeads(): Promise<{
  data: HostLead[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("host_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data as HostLeadRow[]).map(mapHostLead), error: null };
}

export async function adminSetHostLeadStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("host_leads")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  return { error: error?.message ?? null };
}
