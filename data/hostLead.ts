export const HOST_VENUE_TYPES = [
  "Wedding",
  "Corporate",
  "Birthday",
  "Engagement",
  "Conference",
  "Concert",
  "Other",
] as const;

export type HostVenueType = (typeof HOST_VENUE_TYPES)[number];

export type HostLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  venueName: string;
  city: string;
  venueType: HostVenueType;
  capacity: number;
  message: string | null;
  createdAt: string;
};

export type HostLeadInput = {
  fullName: string;
  email: string;
  phone: string;
  venueName: string;
  city: string;
  venueType: HostVenueType;
  capacity: number;
  message?: string;
};
