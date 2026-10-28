import { RelockButton } from "@/components/relock-button";

// Every /preview/* page is gated by middleware.ts; this just adds the
// floating "Lock again" pill on top of whatever the page renders.
export default function PreviewLayout({
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
