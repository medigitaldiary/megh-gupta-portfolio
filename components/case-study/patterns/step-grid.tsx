import { Children, isValidElement, type ReactNode } from "react";
import { Eyebrow } from "../primitives/eyebrow";

// StepGrid — one component, three jobs:
//   parallel — a set of 3–6 workstreams, equal weight.
//   sequence — an ordered process of 2–5 steps.
//   compare  — exactly two cells, Before / After.
//
// A cell is <StepGrid.Cell title eyebrow metric>. The metric slot is
// expected to be a <Metric variant="inline" /> or similar — rendered in
// the cell's top-right.

type Variant = "parallel" | "sequence" | "compare";

type CellProps = {
  title: string;
  eyebrow?: string;
  metric?: ReactNode;
  children: ReactNode;
  // Internal — set by the parent StepGrid; MDX authors don't touch.
  _variant?: Variant;
  _index?: number;
  _total?: number;
  _numbered?: boolean;
};

function Cell({
  title,
  eyebrow,
  metric,
  children,
  _variant = "parallel",
  _index = 0,
  _total = 1,
  _numbered = false,
}: CellProps) {
  const number = String(_index + 1).padStart(2, "0");
  const isCompare = _variant === "compare";
  const isSequence = _variant === "sequence";

  // Compare variant: left-border stripe (muted for cell 0, accent for cell 1).
  // Sequence variant: hairline connector to the right (desktop) or below (mobile).
  const borderClass = isCompare
    ? _index === 0
      ? "border-l-4 border-l-fg-muted"
      : "border-l-4 border-l-accent"
    : "";

  const connectorClass =
    isSequence && _index < _total - 1
      ? "relative after:absolute after:left-6 after:top-full after:h-6 after:w-px after:bg-border after:content-[''] md:after:left-full md:after:top-1/2 md:after:h-px md:after:w-6"
      : "";

  const displayedEyebrow =
    eyebrow ?? (_numbered ? `Step ${number}` : undefined);

  return (
    <div
      className={`rounded-lg border border-border bg-bg-elevated p-6 ${borderClass} ${connectorClass}`.trim()}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {_numbered || displayedEyebrow ? (
            <Eyebrow variant="micro">
              {_numbered ? (
                <>
                  <span>{number}</span>
                  {displayedEyebrow ? (
                    <>
                      <span aria-hidden="true" className="mx-1">
                        ·
                      </span>
                      <span>{displayedEyebrow}</span>
                    </>
                  ) : null}
                </>
              ) : (
                displayedEyebrow
              )}
            </Eyebrow>
          ) : null}
          <h3 className="mt-3 font-serif text-xl leading-tight text-fg">
            {title}
          </h3>
        </div>
        {metric ? <div className="shrink-0">{metric}</div> : null}
      </div>
      <div className="mt-3 text-sm leading-relaxed text-fg-muted">
        {children}
      </div>
    </div>
  );
}

function StepGridBase({
  variant = "parallel",
  numbered = false,
  children,
}: {
  variant?: Variant;
  numbered?: boolean;
  children: ReactNode;
}) {
  const cells = Children.toArray(children).filter(isValidElement);
  const total = cells.length;
  // Sequence forces numbering on; parallel honours the prop; compare off.
  const effectiveNumbered =
    variant === "sequence" ? true : variant === "compare" ? false : numbered;

  const gridClass =
    variant === "compare"
      ? "my-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6"
      : variant === "sequence"
        ? "my-10 grid grid-cols-1 gap-8 md:grid-flow-col md:auto-cols-fr md:gap-10"
        : total <= 2
          ? "my-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6"
          : "my-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3";

  return (
    <div className={gridClass}>
      {cells.map((child, i) => {
        if (!isValidElement<CellProps>(child)) return child;
        return (
          <Cell
            key={child.key ?? i}
            {...child.props}
            _variant={variant}
            _index={i}
            _total={total}
            _numbered={effectiveNumbered}
          />
        );
      })}
    </div>
  );
}

export const StepGrid = Object.assign(StepGridBase, { Cell });
