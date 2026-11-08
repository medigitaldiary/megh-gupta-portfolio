import type { ReactNode } from "react";
import { slugifyHeading } from "@/lib/case-study-toc";

function textFromChildren(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) return children.map(textFromChildren).join("");
  if (children && typeof children === "object" && "props" in children) {
    const props = children.props as { children?: ReactNode };
    return textFromChildren(props.children);
  }
  return "";
}

/** Markdown `##` headings. The id matches `extractToc`, so the index can jump here. */
export function MarkdownH2({ children }: { children?: ReactNode }) {
  const label = textFromChildren(children).trim();
  const id = label ? slugifyHeading(label) : undefined;
  return (
    <h2
      id={id}
      className="scroll-mt-24 font-display text-[1.75rem] leading-tight text-fg md:text-[2.25rem]"
    >
      {children}
    </h2>
  );
}
