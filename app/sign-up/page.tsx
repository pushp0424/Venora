import type { Metadata } from "next";
import type { UserRole } from "@/data/user";
import { USER_ROLES } from "@/data/user";
import AuthShell from "@/components/auth/AuthShell";
import SignUpForm, { SignUpFooter } from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up — Venora",
  description: "Create your Venora account as a client or host.",
};

type SignUpPageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const roleParam = params.role;
  const defaultRole: UserRole =
    roleParam === "host" && USER_ROLES.includes(roleParam)
      ? "host"
      : "client";

  return (
    <AuthShell
      title="Join Venora"
      subtitle="Create an account to book exceptional venues or list your own space."
      footer={<SignUpFooter />}
    >
      <SignUpForm defaultRole={defaultRole} />
    </AuthShell>
  );
}
