export const hostSidebarNav = [
  { label: "Dashboard", href: "/host/dashboard", icon: "grid" },
  { label: "My Venues", href: "/host/dashboard/venues", icon: "building" },
  {
    label: "Booking Requests",
    href: "/host/dashboard/bookings",
    icon: "calendar",
  },
  { label: "Analytics", href: "/host/dashboard/analytics", icon: "chart" },
] as const;
