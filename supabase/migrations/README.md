# Venora SQL migrations

Run in **lexicographic order** (timestamp prefixes).

## Fresh Supabase project

1. Link project: `supabase link`
2. Push: `supabase db push`  
   Or paste each file into **SQL Editor** in order.

## Existing project (partial schema)

Migrations use `IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` where possible. Run all `202505301*` files after any earlier `20250529120000` profiles bootstrap.

## Documentation

See [`../docs/DATABASE.md`](../docs/DATABASE.md) for ERD, RLS matrix, and workflows.
