import type { Metadata } from "next";
import "./scope.css";

export const metadata: Metadata = {
  title: "About v44",
  description:
    "Vox-style paper-collage About fold. Pine, oatmeal, and walk-style cut-outs. Preview only.",
  robots: { index: false, follow: false },
};

export default function AboutVoxV44Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="v44-scope">{children}</div>;
}
