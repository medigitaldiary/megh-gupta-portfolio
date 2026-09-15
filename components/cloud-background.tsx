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
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#A9C4DC_0%,#C9DAE7_28%,#E4E7DE_62%,#F1EAD6_92%,#F5EBD6_100%)]" />
      <div className="absolute inset-x-0 top-[8%] mx-auto h-[45vh] w-[45vh] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,244,214,0.9)_0%,rgba(255,235,196,0.35)_35%,transparent_65%)] blur-2xl" />
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <div className="cloud cloud-4" />
      <div className="cloud cloud-5" />
      <div className="cloud cloud-6" />
    </div>
  );
}
