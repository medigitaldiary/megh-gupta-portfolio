"use client";

import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import { relock } from "@/app/unlock/actions";

/** Floating "Lock again" pill shown on every locked page. */
export function RelockButton() {
  const next = usePathname();

  return (
    <form
      action={relock}
      className="fixed right-4 bottom-4 z-[60] print:hidden"
    >
      <input type="hidden" name="next" value={next} />
      <PillButton />
    </form>
  );
}

function PillButton() {
  const { pending } = useFormStatus();
  return (
    <button
      id="relock-button"
      type="submit"
      disabled={pending}
      title="Delete your 24h pass and lock these pages again"
      className="group inline-flex items-center gap-2 rounded-full border border-[#1f3b2e]/15 bg-[#f3ebd9]/85 px-3.5 py-2 font-mono text-[0.68rem] text-[#1f3b2e] uppercase tracking-[0.18em] shadow-[0_10px_30px_-12px_rgba(31,59,46,0.45)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1f3b2e] hover:text-[#e8dcc6] disabled:opacity-60"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      {pending ? "Locking…" : "Lock again"}
    </button>
  );
}
