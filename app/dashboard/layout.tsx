import { requireClient } from "@/lib/auth";

export default async function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireClient();
  return children;
}
