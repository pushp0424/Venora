"use client";

import { useEffect } from "react";

type SuccessToastProps = {
  message: string;
  onDismiss: () => void;
};

export default function SuccessToast({ message, onDismiss }: SuccessToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-4 right-4 z-[60] mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl sm:left-auto sm:right-6"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-9" />
        </svg>
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-semibold text-neutral-900">Success</p>
        <p className="mt-0.5 text-sm text-neutral-600">{message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        aria-label="Dismiss"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
