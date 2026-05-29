"use client";

import { useTransition } from "react";
import { signOutAction } from "@/app/auth/actions";

type SignOutButtonProps = {
  className?: string;
  label?: string;
};

export default function SignOutButton({
  className = "text-sm font-medium text-neutral-400 transition-colors hover:text-[#D4AF37]",
  label = "Log out",
}: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      className={className}
      onClick={() => startTransition(() => signOutAction())}
    >
      {isPending ? "Signing out…" : label}
    </button>
  );
}
