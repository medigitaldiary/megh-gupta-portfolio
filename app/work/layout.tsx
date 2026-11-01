import { RelockButton } from "@/components/relock-button";

// Case studies are locked until launch (middleware.ts). Remove "/work"
// from the middleware matcher + PROTECTED_PREFIXES, and this layout,
// when they go public.
export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <RelockButton />
    </>
  );
}
