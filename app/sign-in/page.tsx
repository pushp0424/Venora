import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import SignInForm, { SignInFooter } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In — Venora",
  description: "Sign in to your Venora account.",
};

type SignInPageProps = {
  searchParams: Promise<{ redirectTo?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirectTo ?? "";

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your venues, bookings, and saved spaces."
      footer={<SignInFooter />}
    >
      <SignInForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
