export type SavedVenue = {
  id: string;
  name: string;
  location: string;
  price: string;
  image: string;
};

export type ClientBooking = {
  id: string;
  venueName: string;
  eventDate: string;
  guests: number;
  status: "Confirmed" | "Pending" | "Cancelled";
  amount: string;
};

export const clientSidebarNav = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Saved Venues", href: "/dashboard/saved-venues", icon: "building" },
  { label: "Bookings", href: "/dashboard/bookings", icon: "calendar" },
  { label: "Profile", href: "/dashboard/profile", icon: "settings" },
] as const;

export const clientDashboardStats = [
  { label: "Upcoming events", value: "2", change: "+1 this month" },
  { label: "Saved venues", value: "5", change: "+2 new saves" },
  { label: "Total bookings", value: "8", change: "All time" },
  { label: "Avg. spend", value: "$2,450", change: "Per event" },
];

export const savedVenues: SavedVenue[] = [
  {
    id: "glass-pavilion",
    name: "The Glass Pavilion",
    location: "Manhattan, New York",
    price: "$2,400",
    image:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "noir-studio",
    name: "Noir Studio Loft",
    location: "SoMa, San Francisco",
    price: "$1,850",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80",
  },
];

export const clientBookings: ClientBooking[] = [
  {
    id: "cb-1001",
    venueName: "The Glass Pavilion",
    eventDate: "Aug 14, 2026",
    guests: 120,
    status: "Confirmed",
    amount: "$2,400",
  },
  {
    id: "cb-1002",
    venueName: "Noir Studio Loft",
    eventDate: "Sep 3, 2026",
    guests: 80,
    status: "Pending",
    amount: "$1,850",
  },
];
