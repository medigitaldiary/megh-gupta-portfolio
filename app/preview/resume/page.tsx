import type { Metadata } from "next";
import { ResumeAgents } from "@/components/resume-agents/resume-agents";
import { ResumeDocument } from "@/components/resume-document";

export const metadata: Metadata = {
  title: "Resume agents",
  description: "A preview where named cursors build Megh Gupta's resume.",
  robots: { index: false, follow: false },
};

export default function PreviewResumePage() {
  return (
    <ResumeAgents>
      <ResumeDocument />
    </ResumeAgents>
  );
}
