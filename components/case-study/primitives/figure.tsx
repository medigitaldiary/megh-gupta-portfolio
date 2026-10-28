import Image from "next/image";
import type { ReactNode } from "react";
import { Eyebrow } from "./eyebrow";

// Figure — image, SVG, or diagram with a caption. Variants:
//   prose     — fits the max-w-2xl prose column (default).
//   wide      — same column (CLAUDE.md locks max-w-2xl), but breaks the
//               prose rhythm — used for a diagram that is the point of
//               the section.
//   svg       — accepts inline SVG children; no next/image.
//   annotated — image with positioned accent-circled numbers overlaid
//               and a numbered legend below the caption.
//
// A missing image renders a labeled placeholder box the right aspect
// ratio (per the handoff doc) so a page without assets still ships.

export type FigureVariant = "prose" | "wide" | "svg" | "annotated";

type AnnotationMark = { x: number; y: number; label: string };

type BaseProps = {
  caption?: string;
  eyebrow?: string;
  note?: string;
  aspectRatio?: string;
  className?: string;
};

type ImageProps = BaseProps & {
  variant?: "prose" | "wide";
  src: string;
  alt: string;
  children?: never;
  annotations?: never;
  isPlaceholder?: boolean;
};

type SvgProps = BaseProps & {
  variant: "svg";
  children: ReactNode;
  src?: never;
  alt?: never;
  annotations?: never;
  isPlaceholder?: never;
};

type AnnotatedProps = BaseProps & {
  variant: "annotated";
  src: string;
  alt: string;
  annotations: AnnotationMark[];
  children?: never;
  isPlaceholder?: boolean;
};

export type FigureProps = ImageProps | SvgProps | AnnotatedProps;

function CaptionBar({
  eyebrow,
  caption,
  note,
}: {
  eyebrow?: string;
  caption?: string;
  note?: string;
}) {
  if (!eyebrow && !caption && !note) return null;
  return (
    <figcaption className="border-t border-border px-4 py-2.5 md:px-5 md:py-3">
      {eyebrow ? (
        <Eyebrow variant="micro" as="span">
          {eyebrow}
        </Eyebrow>
      ) : null}
      {caption ? (
        <p
          className={`text-sm leading-snug text-fg-muted ${
            eyebrow ? "mt-1" : ""
          }`}
        >
          {caption}
        </p>
      ) : null}
      {note ? (
        <p
          className="mt-2 text-sm leading-snug text-fg-subtle"
          style={{
            fontFamily: "var(--font-hand), var(--font-caveat), cursive",
          }}
        >
          {note}
        </p>
      ) : null}
    </figcaption>
  );
}

function Placeholder({
  src,
  aspectRatio,
}: {
  src: string;
  aspectRatio: string;
}) {
  return (
    <div
      className="flex w-full items-center justify-center bg-bg-elevated"
      style={{ aspectRatio }}
    >
      <code className="px-4 text-center font-mono text-xs text-fg-subtle">
        {src}
        <br />
        placeholder — {aspectRatio.replace("/", " × ")}
      </code>
    </div>
  );
}

export function Figure(props: FigureProps) {
  const aspectRatio = props.aspectRatio ?? "16/9";
  const base =
    "my-10 overflow-hidden rounded-md border border-border bg-bg-elevated";

  if (props.variant === "svg") {
    return (
      <figure className={`${base} ${props.className ?? ""}`.trim()}>
        <div className="p-6">{props.children}</div>
        <CaptionBar
          eyebrow={props.eyebrow}
          caption={props.caption}
          note={props.note}
        />
      </figure>
    );
  }

  const showPlaceholder = !!props.isPlaceholder;

  return (
    <figure className={`${base} ${props.className ?? ""}`.trim()}>
      <div className="relative w-full" style={{ aspectRatio }}>
        {showPlaceholder ? (
          <Placeholder src={props.src} aspectRatio={aspectRatio} />
        ) : (
          <Image
            src={props.src}
            alt={props.alt}
            fill
            sizes="(min-width: 768px) 672px, 100vw"
            className="object-cover"
          />
        )}
        {props.variant === "annotated" && props.annotations
          ? props.annotations.map((a, i) => (
              <span
                key={`${a.x}-${a.y}-${a.label}`}
                aria-hidden="true"
                className="absolute inline-flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent font-mono text-xs text-accent-fg ring-2 ring-bg"
                style={{ left: `${a.x}%`, top: `${a.y}%` }}
              >
                {i + 1}
              </span>
            ))
          : null}
      </div>
      <CaptionBar
        eyebrow={props.eyebrow}
        caption={props.caption}
        note={props.note}
      />
      {props.variant === "annotated" && props.annotations ? (
        <ol className="list-decimal border-t border-border px-6 py-3 text-sm text-fg-muted">
          {props.annotations.map((a) => (
            <li key={a.label} className="mt-1 first:mt-0">
              {a.label}
            </li>
          ))}
        </ol>
      ) : null}
    </figure>
  );
}
