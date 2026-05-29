export type DashboardStat = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

export type VendorVenue = {
  id: string;
  name: string;
  location: string;
  status: "Active" | "Draft" | "Paused";
  bookings: number;
  revenue: string;
  image: string;
};

export type RecentBooking = {
  id: string;
  guestName: string;
  venue: string;
  eventDate: string;
  guests: number;
  status: "Confirmed" | "Pending" | "Cancelled";
  amount: string;
};

export const dashboardStats: DashboardStat[] = [
  {
    label: "Total revenue",
    value: "$48,200",
    change: "+12.4%",
    trend: "up",
  },
  {
    label: "Active venues",
    value: "6",
    change: "+1",
    trend: "up",
  },
  {
    label: "Total bookings",
    value: "34",
    change: "+8.2%",
    trend: "up",
  },
  {
    label: "Avg. rating",
    value: "4.96",
    change: "+0.04",
    trend: "up",
  },
];

export const myVenues: VendorVenue[] = [
  {
    id: "glass-pavilion",
    name: "The Glass Pavilion",
    location: "Manhattan, New York",
    status: "Active",
    bookings: 12,
    revenue: "$28,800",
    image:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "noir-studio-loft",
    name: "Noir Studio Loft",
    location: "SoMa, San Francisco",
    status: "Active",
    bookings: 8,
    revenue: "$14,800",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cedar-hall-estate",
    name: "Cedar Hall Estate",
    location: "Mayfair, London",
    status: "Active",
    bookings: 9,
    revenue: "$28,800",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "skyline-terrace",
    name: "Skyline Terrace",
    location: "Downtown, Chicago",
    status: "Paused",
    bookings: 5,
    revenue: "$10,500",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80",
  },
];

export const recentBookings: RecentBooking[] = [
  {
    id: "bk-1042",
    guestName: "Sarah Chen",
    venue: "The Glass Pavilion",
    eventDate: "Jun 14, 2026",
    guests: 150,
    status: "Confirmed",
    amount: "$2,400",
  },
  {
    id: "bk-1041",
    guestName: "Marcus Williams",
    venue: "Noir Studio Loft",
    eventDate: "Jun 18, 2026",
    guests: 85,
    status: "Pending",
    amount: "$1,850",
  },
  {
    id: "bk-1040",
    guestName: "Elena Rodriguez",
    venue: "Cedar Hall Estate",
    eventDate: "Jun 22, 2026",
    guests: 220,
    status: "Confirmed",
    amount: "$3,200",
  },
  {
    id: "bk-1039",
    guestName: "James Okonkwo",
    venue: "Skyline Terrace",
    eventDate: "Jun 28, 2026",
    guests: 60,
    status: "Confirmed",
    amount: "$2,100",
  },
  {
    id: "bk-1038",
    guestName: "Priya Sharma",
    venue: "The Glass Pavilion",
    eventDate: "Jul 2, 2026",
    guests: 120,
    status: "Cancelled",
    amount: "$2,400",
  },
];

/** @deprecated Use hostSidebarNav from @/data/hostDashboard */
export const sidebarNav = [
  { label: "Dashboard", href: "/host/dashboard", icon: "grid" },
  { label: "My Venues", href: "/host/dashboard#venues", icon: "building" },
  { label: "Bookings", href: "/host/dashboard#bookings", icon: "calendar" },
  { label: "Analytics", href: "/host/dashboard#analytics", icon: "chart" },
  { label: "Settings", href: "/host/dashboard#settings", icon: "settings" },
] as const;
