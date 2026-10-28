import { Children, isValidElement, type ReactNode } from "react";
import { Eyebrow } from "../primitives/eyebrow";

// DataTable — proper tables when the content genuinely reads better in
// rows and columns than as prose or cards. Variants:
//   data        — compact scannable, numeric cells right-aligned via
//                 tabular-nums (default).
//   comparison  — bold left attribute column + N value columns.
//   ownership   — specialized 2-column "I owned / Team owned".
//   responsibility — generalization of ownership to N role columns.
//
// data / comparison take <thead> + <tbody> children directly.
// ownership / responsibility take <DataTable.Column label> children.

type Variant = "data" | "comparison" | "ownership" | "responsibility";

type ColumnProps = {
  label: string;
  children: ReactNode;
};

function Column({ label, children }: ColumnProps) {
  // Rendered inside the ownership / responsibility layout; the layout
  // itself places this component in a labeled cell.
  return (
    <div>
      <Eyebrow variant="accent">{label}</Eyebrow>
      <div className="mt-4 text-sm leading-relaxed text-fg-muted [&_ul]:space-y-2 [&_ul>li]:relative [&_ul>li]:pl-4 [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.6em] [&_ul>li]:before:h-px [&_ul>li]:before:w-2 [&_ul>li]:before:bg-fg-subtle">
        {children}
      </div>
    </div>
  );
}

function DataTableBase({
  variant = "data",
  caption,
  children,
}: {
  variant?: Variant;
  caption?: string;
  children: ReactNode;
}) {
  if (variant === "ownership" || variant === "responsibility") {
    const cols = Children.toArray(children).filter(isValidElement);
    // Static grid classes — Tailwind can't scan dynamic ${cols.length}.
    const gridCols =
      cols.length === 2
        ? "md:grid-cols-2"
        : cols.length === 3
          ? "md:grid-cols-3"
          : cols.length === 4
            ? "md:grid-cols-4"
            : "md:grid-cols-2";
    const dividerCols =
      cols.length === 2
        ? "md:[&>*:first-child]:border-r md:[&>*:first-child]:border-border md:[&>*:first-child]:pr-6 md:[&>*:last-child]:pl-6"
        : "md:divide-x md:divide-border";
    return (
      <section className="my-10 overflow-hidden rounded-lg border border-border bg-bg-elevated">
        <div
          className={`grid grid-cols-1 gap-6 p-6 ${gridCols} md:gap-0 ${dividerCols}`}
        >
          {cols}
        </div>
      </section>
    );
  }

  return (
    <div className="my-10 overflow-x-auto rounded-md border border-border bg-bg-elevated [mask-image:linear-gradient(to_right,black_0,black_95%,transparent_100%)]">
      <table className="w-full border-collapse text-left text-sm text-fg-muted [&_thead_th]:border-b [&_thead_th]:border-border [&_thead_th]:px-4 [&_thead_th]:py-2 [&_thead_th]:font-mono [&_thead_th]:text-[11px] [&_thead_th]:uppercase [&_thead_th]:tracking-wider [&_thead_th]:text-fg-subtle [&_tbody_td]:border-b [&_tbody_td]:border-border/60 [&_tbody_td]:px-4 [&_tbody_td]:py-3 [&_tbody_tr:last-child_td]:border-b-0 [&_tbody_td.num]:text-right [&_tbody_td.num]:font-mono [&_tbody_td.num]:text-fg [&_tbody_td.num]:tabular-nums">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}

export const DataTable = Object.assign(DataTableBase, { Column });
