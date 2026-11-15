import type { Metadata } from "next";
import { ResumeWalkthrough } from "@/components/resume-agents/resume-walkthrough";

export const metadata: Metadata = {
  title: "Resume, built live",
  description: "Watch the cursors build Megh Gupta's resume from one button.",
  robots: { index: false, follow: false },
};

export default function PreviewResumeV2Page() {
  return <ResumeWalkthrough />;
}
