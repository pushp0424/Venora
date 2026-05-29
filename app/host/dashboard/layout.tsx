import { VendorVenuesProvider } from "@/context/VendorVenuesContext";
import { requireHost } from "@/lib/auth";

export default async function HostDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireHost();

  return <VendorVenuesProvider>{children}</VendorVenuesProvider>;
}
