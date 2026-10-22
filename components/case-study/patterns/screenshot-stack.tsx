import { Children, isValidElement, type ReactNode } from "react";
import { Eyebrow } from "../primitives/eyebrow";
import { Figure } from "../primitives/figure";

// ScreenshotStack — multiple screenshots that belong together. Each
// item is still a captioned Figure; the stack is the composition.
// Layout: row (default, 2–3 items across) or column (vertical stack).

type Layout = "row" | "column";

type ItemProps = {
  src: string;
  alt: string;
  caption?: string;
};

function Item({ src, alt, caption }: ItemProps) {
  // Rendered through Figure prose so the per-item styling matches the
  // rest of the system. The outer grid controls layout.
  return <Figure variant="prose" src={src} alt={alt} caption={caption} />;
}

function ScreenshotStackBase({
  layout = "row",
  eyebrow,
  children,
}: {
  layout?: Layout;
  eyebrow?: string;
  children: ReactNode;
}) {
  const items = Children.toArray(children).filter(isValidElement);
  const count = items.length;
  const colsClass =
    layout === "column"
      ? "grid-cols-1"
      : count >= 3
        ? "md:grid-cols-3"
        : count === 2
          ? "md:grid-cols-2"
          : "md:grid-cols-1";
  return (
    <div className="my-10">
      <div className={`grid grid-cols-1 gap-5 md:gap-6 ${colsClass}`}>
        {/* Each child already carries its own <Figure> frame via Item. */}
        {items}
      </div>
      {eyebrow ? (
        <Eyebrow variant="micro" className="mt-3 block text-center">
          {eyebrow}
        </Eyebrow>
      ) : null}
    </div>
  );
}

export const ScreenshotStack = Object.assign(ScreenshotStackBase, { Item });
