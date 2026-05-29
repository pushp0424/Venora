import type {
  Venue,
  VenueAvailability,
  VenueInput,
  VenueStatus,
} from "@/data/venues";

export type VenueRow = {
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
  host_id?: string | null;
  status?: VenueStatus | string | null;
  availability?: VenueAvailability | string | null;
  created_at?: string;
  updated_at?: string;
};

export function mapRowToVenue(row: VenueRow): Venue {
  return {
    id: String(row.id),
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
    hostId: row.host_id ?? null,
    status: (row.status as VenueStatus) ?? "approved",
    availability: (row.availability as VenueAvailability) ?? "available",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapVenueToRow(
  input: VenueInput,
  hostId?: string | null
): Record<string, unknown> {
  return {
    id: input.id,
    name: input.name,
    city: input.city,
    location: input.location,
    price: input.price,
    price_amount: input.priceAmount,
    rating: input.rating,
    image: input.image,
    tag: input.tag,
    description: input.description,
    capacity: input.capacity,
    capacity_max: input.capacityMax,
    host_id: input.hostId ?? hostId ?? null,
    status: input.status ?? "pending",
    availability: input.availability ?? "available",
    updated_at: new Date().toISOString(),
  };
}
