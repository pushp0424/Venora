import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase";

export type ContentBlock = {
  id: string;
  slug: string;
  title: string;
  body: string;
  updatedAt: string;
};

type ContentRow = {
  id: string;
  slug: string;
  title: string;
  body: string;
  updated_at: string;
};

function mapContent(row: ContentRow): ContentBlock {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    body: row.body,
    updatedAt: row.updated_at,
  };
}

export async function adminGetContentBlocks(): Promise<{
  data: ContentBlock[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("content_blocks")
    .select("*")
    .order("slug", { ascending: true });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (data as ContentRow[]).map(mapContent), error: null };
}

export async function adminUpdateContentBlock(
  id: string,
  title: string,
  body: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("content_blocks")
    .update({ title, body, updated_at: new Date().toISOString() })
    .eq("id", id);

  return { error: error?.message ?? null };
}
