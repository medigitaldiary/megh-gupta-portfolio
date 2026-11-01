import type { Metadata } from "next";
import { BackstagePass } from "@/components/backstage-pass";
import { CloudBackground } from "@/components/cloud-background";
import { isConfigured, safeNextPath } from "@/lib/preview-auth";
import "./backstage.css";

export const metadata: Metadata = {
  title: "Backstage",
  description: "Works in progress. Password required.",
  robots: { index: false, follow: false },
};

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = safeNextPath(Array.isArray(rawNext) ? rawNext[0] : rawNext);

  // Rendered on the server (IST) so the stub's date stamp never mismatches.
  const now = new Date();
  const issuedLabel = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  })
    .format(now)
    .toUpperCase();
  const serial = String(((now.getTime() / 1000 / 60) % 10000) | 0).padStart(
    4,
    "0",
  );

  return (
    <main
      id="main"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-12 md:px-8"
    >
      <CloudBackground palette="dawn" />
      {/* soft veil so the ticket pops off the sky */}
      <div
        aria-hidden="true"
        className="-z-10 absolute inset-0 backdrop-blur-[2px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(232,220,198,0.55) 0%, rgba(232,220,198,0.15) 60%, transparent 85%)",
        }}
      />
      <BackstagePass
        next={next}
        configured={isConfigured()}
        issuedLabel={issuedLabel}
        serial={serial}
      />
    </main>
  );
}
