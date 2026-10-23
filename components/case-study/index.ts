// Single export surface for the case study system.
//
// Every case study MDX file is rendered through
// app/work/[slug]/page.tsx, which passes this module as the `components`
// prop on MDXRemote. Adding a new primitive later means adding one line
// here — the route stays untouched.
//
// Order below matches the module layout:
//   primitives / patterns / layouts / sub-component aliases.

export type { SectionVariant } from "./layouts/section";
export { Section } from "./layouts/section";
// One-off: case-study-specific wrapper around <Pipeline>. Kept in the
// barrel so MDX can call <AiCallPipeline /> directly. If the one-offs
// list grows past a handful, promote them to a separate module.
export { AiCallPipeline } from "./one-offs/ai-call-pipeline";
export { DataTable } from "./patterns/data-table";
export type { PipelineStage } from "./patterns/pipeline";
export {
  AnalysisIcon,
  DeliverIcon,
  HumanIcon,
  Pipeline,
  TranscriptIcon,
  WaveformIcon,
} from "./patterns/pipeline";
// Convenience alias — some case studies may want to type <Screenshots>
// as the shorter name; both work in MDX.
export {
  ScreenshotStack,
  ScreenshotStack as Screenshots,
} from "./patterns/screenshot-stack";
export { StepGrid } from "./patterns/step-grid";
export { Timeline } from "./patterns/timeline";
export type { CalloutVariant } from "./primitives/callout";
export { Callout } from "./primitives/callout";
export type { EyebrowVariant } from "./primitives/eyebrow";
export { Eyebrow } from "./primitives/eyebrow";
export type { FigureProps, FigureVariant } from "./primitives/figure";
export { Figure } from "./primitives/figure";
export type { MetricVariant } from "./primitives/metric";
export { Metric, MetricRow } from "./primitives/metric";
export type { PillVariant } from "./primitives/pill";
export { Pill } from "./primitives/pill";
export { Quote } from "./primitives/quote";
