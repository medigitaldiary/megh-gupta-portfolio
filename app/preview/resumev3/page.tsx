import type { Metadata } from "next";
import { ResumeWalkthrough } from "@/components/resume-agents/resume-walkthrough";

export const metadata: Metadata = {
  title: "Resume, built as you scroll",
  description:
    "Watch the cursors build the visible fold, then the next blocks as you scroll.",
  robots: { index: false, follow: false },
};

export default function PreviewResumeV3Page() {
  return <ResumeWalkthrough scroll />;
}
