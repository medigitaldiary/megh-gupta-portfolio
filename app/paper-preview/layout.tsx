import { RelockButton } from "@/components/relock-button";

// Gated by middleware.ts; adds the floating "Lock again" pill.
export default function PaperPreviewLayout({
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
