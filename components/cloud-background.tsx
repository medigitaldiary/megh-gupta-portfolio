/**
 * Soft drifting-cloud background for the coming-soon page.
 *
 * Sky is a top-to-bottom gradient from a pale cool tone to the warm bg.
 * Clouds are radial-gradient "puffs" of near-white, heavily blurred, then
 * drifted across the viewport by CSS keyframes (see app/globals.css).
 * No JS runtime cost. Honors prefers-reduced-motion.
 */
export function CloudBackground() {
  return (
    <div aria-hidden="true" className="-z-20 absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#E7EDF0_0%,#F1F2EF_45%,#FAFAF7_100%)]" />
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <div className="cloud cloud-4" />
      <div className="cloud cloud-5" />
      <div className="cloud cloud-6" />
    </div>
  );
}
