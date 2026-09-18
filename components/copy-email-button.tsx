"use client";

import { useState } from "react";

type Props = {
  email: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Click-to-copy replacement for the plain `mailto:` link.
 * Shows a clipboard icon at rest and swaps to a checkmark + "Copied"
 * label for ~1.8s after a successful copy. Falls back to a mailto: on
 * browsers without the async clipboard API (very old Safari, etc.).
 */
export function CopyEmailButton({ email, className, style }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
        return;
      } catch {
        // fall through to mailto:
      }
    }
    window.location.href = `mailto:${email}`;
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      style={style}
      aria-live="polite"
      aria-label={
        copied
          ? "Email copied to clipboard"
          : `Copy email ${email} to clipboard`
      }
      title={copied ? "Copied" : "Click to copy"}
    >
      <span>{copied ? "Copied to clipboard" : email}</span>
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
      role="presentation"
    >
      <rect x="9" y="9" width="12" height="12" rx="2" ry="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
      role="presentation"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
