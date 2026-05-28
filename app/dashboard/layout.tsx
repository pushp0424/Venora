import { VendorVenuesProvider } from "@/context/VendorVenuesContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VendorVenuesProvider>{children}</VendorVenuesProvider>;
}
