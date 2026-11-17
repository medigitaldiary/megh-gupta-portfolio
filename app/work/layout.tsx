import { SiteFooter } from "@/components/site-footer";

// Case studies stay gated by the 24h pass in middleware.ts. Remove "/work"
// from the middleware matcher + PROTECTED_PREFIXES when they go public.
export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  );
}
