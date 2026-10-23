// Case-study-specific wrapper that pre-fills <Pipeline> with the AI
// Call Analysis stages. Lives in one-offs/ because the stages are
// case-study-specific — generic Pipeline stays in patterns/. MDX
// usage: <AiCallPipeline />, no props.
//
// The brief's design system docs (CONTENT-MODEL.md §5) recommend this
// pattern for one-off visuals: keep the data at the component layer,
// keep the MDX call site a single JSX tag.

import {
  AnalysisIcon,
  DeliverIcon,
  HumanIcon,
  Pipeline,
  TranscriptIcon,
  WaveformIcon,
} from "../patterns/pipeline";

export function AiCallPipeline() {
  return (
    <Pipeline
      footnote="Nightly batch — not real-time. Press Play to walk through, or click any stage to inspect it."
      stages={[
        {
          id: "ingest",
          label: "01 · Ingest",
          title: "Nightly job picks up today's recordings",
          description:
            "A scheduled batch identifies new recordings in cloud storage at the end of the day.",
          icon: <WaveformIcon />,
          preview: (
            <div>
              <p className="font-mono text-xs text-fg-subtle">
                cron · 23:30 IST · queue=call-recordings/YYYY-MM-DD
              </p>
              <p className="mt-2">
                Real-time wasn't necessary for v1. The initial use case is
                next-day coaching and marketing feedback, not live assist.
              </p>
            </div>
          ),
        },
        {
          id: "transcribe",
          label: "02 · Transcribe",
          title: "Sarvam STT handles Hindi / English / Hinglish",
          description:
            "Speech-to-text for Indian-accent calls with mixed-language dialogue.",
          icon: <TranscriptIcon />,
          preview: (
            <div>
              <p>
                Why Sarvam: fit for Hindi/Hinglish and Indian-accent recognition
                at a batch-friendly cost. Transcription quality is the first
                thing the rest of the pipeline depends on.
              </p>
              <p className="mt-3 font-mono text-xs text-fg-subtle">
                <span className="sr-only">Illustrative transcript sample:</span>
                [illustrative] "Sir, risk-return clarify karo…" / "What's the
                lock-in on this?"
              </p>
            </div>
          ),
        },
        {
          id: "analyse",
          label: "03 · Analyse",
          title: "Claude Sonnet evaluates against the rubric",
          description:
            "The LLM reads the transcript, scores against the 6-criterion rubric, and returns structured JSON.",
          icon: <AnalysisIcon />,
          preview: (
            <div>
              <p>
                Why Sonnet: long-transcript analysis, mixed-language handling,
                and reliable structured output. The call-quality rubric and the
                action-item format live in the prompt — not in a trained model.
              </p>
              <p className="mt-3 font-mono text-[11px] leading-snug text-fg-subtle">
                [illustrative output shape — not a real call] score_overall ·
                6.4 · scores by criterion · action_items with concrete tasks and
                deadlines · flags
              </p>
            </div>
          ),
        },
        {
          id: "deliver",
          label: "04 · Deliver",
          title: "Scores + tasks land in Radar",
          description:
            "Score attaches to the user profile; action items become assigned RM tasks with deadlines.",
          icon: <DeliverIcon />,
          preview: (
            <p>
              Radar is where the RM team already works. The pipeline fits into
              the existing surface instead of creating a parallel tool. Scores
              sit on the user profile; action items appear as tasks in the RM's
              queue.
            </p>
          ),
        },
        {
          id: "act",
          label: "05 · Act",
          title: "Human review + marketing feedback loop",
          description:
            "RMs act on tasks. Managers review score patterns. Objection themes can feed back into marketing.",
          icon: <HumanIcon />,
          preview: (
            <p>
              The useful part of the output isn't the number — it's what happens
              in the next 48 hours. Tasks move the follow-up forward; score
              patterns tell managers what to coach next week; recurring
              objections become inputs to copy decisions.
            </p>
          ),
        },
      ]}
    />
  );
}
