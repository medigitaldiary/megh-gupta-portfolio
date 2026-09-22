export function StackIcon({ name }: { name: string }) {
  const p = {
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  switch (name) {
    case "figma":
      return (
        <svg viewBox="0 0 24 24" {...p} role="presentation" aria-hidden="true">
          <path d="M9 3h3v6H9a3 3 0 1 1 0-6z" />
          <path d="M12 3h3a3 3 0 1 1 0 6h-3V3z" />
          <path d="M9 9h3v6H9a3 3 0 1 1 0-6z" />
          <circle cx="15" cy="12" r="3" />
          <path d="M9 15h3v3a3 3 0 1 1-3-3z" />
        </svg>
      );
    case "claude":
      return (
        <svg viewBox="0 0 24 24" {...p} role="presentation" aria-hidden="true">
          <path d="M6 17l4-10 2 5 2-5 4 10" />
          <path d="M8 14h8" />
        </svg>
      );
    case "cursor":
      return (
        <svg viewBox="0 0 24 24" {...p} role="presentation" aria-hidden="true">
          <path d="M5 4l14 6-6 2-2 6-6-14z" />
        </svg>
      );
    case "notion":
      return (
        <svg viewBox="0 0 24 24" {...p} role="presentation" aria-hidden="true">
          <rect x="5" y="4" width="14" height="16" rx="1.5" />
          <path d="M8 8v8M8 8l8 8V8" />
        </svg>
      );
    case "linear":
      return (
        <svg viewBox="0 0 24 24" {...p} role="presentation" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M5 12l7 7M8 6l10 10M13 5l6 6" />
        </svg>
      );
    case "mixpanel":
      return (
        <svg viewBox="0 0 24 24" {...p} role="presentation" aria-hidden="true">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      );
    case "moengage":
      return (
        <svg viewBox="0 0 24 24" {...p} role="presentation" aria-hidden="true">
          <path d="M4 18V8l4 6 4-6 4 6 4-6v10" />
        </svg>
      );
    case "supabase":
      return (
        <svg viewBox="0 0 24 24" {...p} role="presentation" aria-hidden="true">
          <path d="M12 3v9h7l-7 9v-9H5l7-9z" />
        </svg>
      );
    case "vercel":
      return (
        <svg viewBox="0 0 24 24" {...p} role="presentation" aria-hidden="true">
          <path d="M12 4l9 16H3l9-16z" />
        </svg>
      );
    case "postman":
      return (
        <svg viewBox="0 0 24 24" {...p} role="presentation" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M9 15l6-6M13 9l2 2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" {...p} role="presentation" aria-hidden="true">
          <circle cx="12" cy="12" r="7" />
        </svg>
      );
  }
}
