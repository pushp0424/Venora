export const VENUE_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "draft",
] as const;

export type VenueStatus = (typeof VENUE_STATUSES)[number];

export const VENUE_AVAILABILITY = ["available", "limited", "unavailable"] as const;

export type VenueAvailability = (typeof VENUE_AVAILABILITY)[number];

export type Venue = {
  id: string;
  name: string;
  city: string;
  location: string;
  price: string;
  priceAmount: number;
  rating: string;
  image: string;
  tag: string;
  description: string;
  capacity: string;
  capacityMax: number;
  hostId: string | null;
  status: VenueStatus;
  availability: VenueAvailability;
  createdAt?: string;
  updatedAt?: string;
};

export type VenueInput = {
  id?: string;
  name: string;
  city: string;
  location: string;
  price: string;
  priceAmount: number;
  rating: string;
  image: string;
  tag: string;
  description: string;
  capacity: string;
  capacityMax: number;
  hostId?: string | null;
  status?: VenueStatus;
  availability?: VenueAvailability;
};
