"use client";

import Link from "next/link";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { type UnlockState, unlock } from "@/app/unlock/actions";

const PINE = "#1f3b2e";
const DENIED_INK = "#b23a48";

// Fixed bar widths so the barcode renders identically on server + client.
const BARS = [
  3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 1, 2, 4, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 4, 1, 1,
  2, 1, 3, 2, 1, 1, 4, 2, 1, 3,
];

type Props = {
  next: string;
  configured: boolean;
  issuedLabel: string;
  serial: string;
};

export function BackstagePass({
  next,
  configured,
  issuedLabel,
  serial,
}: Props) {
  const [state, formAction, pending] = useActionState<UnlockState, FormData>(
    unlock,
    configured ? { status: "idle" } : { status: "unconfigured" },
  );
  const [value, setValue] = useState("");
  const [reveal, setReveal] = useState(false);
  const [focused, setFocused] = useState(false);
  const shakeRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const denied = state.status === "denied";
  const admitted = state.status === "admitted";
  const attempt = denied ? state.attempt : 0;

  // Wrong password: shake, clear, refocus.
  useEffect(() => {
    if (!attempt) return;
    const el = shakeRef.current;
    if (el) {
      el.classList.remove("bp-shake");
      void el.offsetWidth; // restart the animation
      el.classList.add("bp-shake");
    }
    setValue("");
    inputRef.current?.focus();
  }, [attempt]);

  // Right password: let the stamp + tear play, then walk through the door.
  useEffect(() => {
    if (state.status !== "admitted") return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const t = setTimeout(
      () => window.location.replace(state.next),
      reduce ? 350 : 1650,
    );
    return () => clearTimeout(t);
  }, [state]);

  // Pointer tilt (desktop, fine pointers, motion allowed).
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width;
    const y = (e.clientY - (r.top + r.height / 2)) / r.height;
    el.style.setProperty("--bp-ry", `${(x * 8).toFixed(2)}deg`);
    el.style.setProperty("--bp-rx", `${(-y * 6).toFixed(2)}deg`);
  }, []);
  const onPointerLeave = useCallback(() => {
    const el = tiltRef.current;
    el?.style.setProperty("--bp-ry", "0deg");
    el?.style.setProperty("--bp-rx", "0deg");
  }, []);

  return (
    <div
      className={`bp-stage relative z-10 w-full max-w-3xl ${admitted ? "bp-exit" : ""}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="bp-enter">
        <div className="bp-float">
          <div ref={tiltRef} className="bp-tilt">
            <div ref={shakeRef}>
              <div className="bp-shadow flex flex-col md:flex-row">
                {/* ───────────── Main body ───────────── */}
                <section
                  aria-labelledby="bp-title"
                  className="bp-body relative flex-1 overflow-hidden px-7 pt-8 pb-10 md:px-11 md:pt-10 md:pb-11"
                  style={{ color: PINE }}
                >
                  {/* corner guilloché ring, purely decorative */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 200"
                    className="-right-16 -top-16 pointer-events-none absolute h-56 w-56 opacity-[0.09]"
                  >
                    {Array.from({ length: 9 }, (_, i) => (
                      <circle
                        // biome-ignore lint/suspicious/noArrayIndexKey: static decoration
                        key={i}
                        cx="100"
                        cy="100"
                        r={20 + i * 9}
                        fill="none"
                        stroke={PINE}
                        strokeWidth="1"
                        strokeDasharray={i % 2 ? "2 4" : "none"}
                      />
                    ))}
                  </svg>

                  <div className="flex items-center justify-between gap-4">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-70">
                      Megh Gupta · Studio
                    </p>
                    <span
                      className="rounded-full px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em]"
                      style={{ background: "rgba(203,179,232,0.45)" }}
                    >
                      Works in progress
                    </span>
                  </div>

                  <p
                    className="mt-7 text-xl leading-none md:text-2xl"
                    style={{ fontFamily: "var(--font-hand), cursive" }}
                  >
                    psst… this room is still being painted.
                  </p>

                  <h1
                    id="bp-title"
                    className="mt-3 font-semibold leading-[0.95]"
                    style={{
                      fontSize: "clamp(3rem, 9vw, 5.25rem)",
                      letterSpacing: "-0.045em",
                    }}
                  >
                    Backstage.
                  </h1>

                  <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed opacity-80">
                    Drafts, experiments and half-built ideas live past this
                    door. Show your password and I&apos;ll print you a pass
                    that&apos;s good for 24&nbsp;hours.
                  </p>

                  <form action={formAction} className="mt-8" autoComplete="off">
                    <input type="hidden" name="next" value={next} />
                    <label
                      htmlFor="bp-password"
                      className="font-mono text-[0.65rem] uppercase tracking-[0.25em] opacity-60"
                    >
                      Password
                    </label>

                    <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end">
                      <div className="relative flex-1">
                        <input
                          ref={inputRef}
                          id="bp-password"
                          name="password"
                          type={reveal ? "text" : "password"}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onFocus={() => setFocused(true)}
                          onBlur={() => setFocused(false)}
                          // biome-ignore lint/a11y/noAutofocus: single-purpose screen
                          autoFocus
                          required
                          disabled={pending || admitted || !configured}
                          spellCheck={false}
                          aria-invalid={denied}
                          aria-describedby="bp-status"
                          className="w-full border-0 border-b-2 bg-transparent py-2 pr-10 font-mono text-lg tracking-[0.2em] outline-none focus-visible:shadow-none focus-visible:outline-none disabled:opacity-60"
                          style={{
                            borderColor: denied
                              ? DENIED_INK
                              : "rgba(31,59,46,0.35)",
                            color: reveal ? PINE : "transparent",
                            caretColor: reveal ? PINE : "transparent",
                          }}
                        />
                        {/* Ink-dot overlay for hidden mode */}
                        {!reveal && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 right-10 left-0 flex items-center gap-[7px] overflow-hidden"
                          >
                            {Array.from(
                              { length: Math.min(value.length, 14) },
                              (_, i) => (
                                <span
                                  // biome-ignore lint/suspicious/noArrayIndexKey: one dot per typed char
                                  key={i}
                                  className="bp-dot inline-block h-[9px] w-[9px] rounded-full"
                                  style={{ background: PINE }}
                                />
                              ),
                            )}
                            {focused && (
                              <span
                                className="bp-caret ml-[1px] inline-block h-5 w-[2px]"
                                style={{ background: PINE }}
                              />
                            )}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setReveal((r) => !r);
                            inputRef.current?.focus();
                          }}
                          aria-label={
                            reveal ? "Hide password" : "Show password"
                          }
                          aria-pressed={reveal}
                          className="absolute right-0 bottom-2 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100"
                        >
                          <EyeIcon open={reveal} />
                        </button>
                      </div>

                      <button
                        id="bp-submit"
                        type="submit"
                        disabled={pending || admitted || !configured || !value}
                        className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
                        style={{
                          background: PINE,
                          color: "#e8dcc6",
                          boxShadow: "0 10px 24px -10px rgba(31,59,46,0.6)",
                        }}
                      >
                        {pending ? (
                          <>
                            <Spinner /> Checking…
                          </>
                        ) : admitted ? (
                          "Welcome in"
                        ) : (
                          <>
                            Get my pass
                            <span className="transition-transform duration-200 group-hover:translate-x-1">
                              →
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                    <p
                      id="bp-status"
                      aria-live="polite"
                      className="mt-3 min-h-[1.25rem] text-sm"
                      style={{
                        color:
                          denied || state.status === "unconfigured"
                            ? DENIED_INK
                            : PINE,
                      }}
                    >
                      {denied &&
                        (attempt > 2
                          ? "Still not it. Ask Megh for the current password."
                          : "Not quite. Try again.")}
                      {state.status === "unconfigured" &&
                        "The lock isn't set up yet: PREVIEW_PASSWORD / PREVIEW_SECRET are missing on the server."}
                      {admitted && "Pass printed. Valid for the next 24 hours."}
                    </p>
                  </form>

                  <div
                    className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dashed pt-5 text-xs"
                    style={{ borderColor: "rgba(31,59,46,0.2)" }}
                  >
                    <p className="font-mono opacity-70">
                      <span className="uppercase tracking-[0.2em]">
                        Heading to
                      </span>{" "}
                      <span className="opacity-100">→ {next}</span>
                    </p>
                    <Link
                      href="/"
                      className="underline underline-offset-4 opacity-70 hover:opacity-100"
                    >
                      ← Not supposed to be here?
                    </Link>
                  </div>

                  {/* Stamps */}
                  {denied && (
                    <div
                      key={attempt}
                      aria-hidden="true"
                      className="bp-stamp bp-stamp-fade absolute top-[38%] right-6 px-4 py-1.5 font-mono text-2xl font-bold md:right-10 md:text-3xl"
                      style={{ color: DENIED_INK }}
                    >
                      DENIED
                    </div>
                  )}
                  {admitted && (
                    <div
                      aria-hidden="true"
                      className="bp-stamp absolute top-[34%] right-6 px-4 py-1.5 font-mono text-2xl font-bold md:right-10 md:text-3xl"
                      style={{ color: PINE }}
                    >
                      ADMITTED
                    </div>
                  )}
                </section>

                {/* ───────────── Tear-off stub ───────────── */}
                <aside
                  aria-hidden="true"
                  className={`bp-stub relative flex shrink-0 flex-row items-center justify-between gap-5 px-7 py-6 md:w-52 md:flex-col md:items-stretch md:px-6 md:py-9 ${admitted ? "bp-tear" : ""}`}
                  style={{ color: PINE }}
                >
                  <span className="bp-perf" />

                  <div className="md:text-center">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] opacity-60">
                      Admit
                    </p>
                    <p className="font-semibold text-4xl leading-none tracking-tight md:text-5xl">
                      One
                    </p>
                    <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.25em] opacity-60">
                      Studio access
                    </p>
                  </div>

                  <div
                    className="hidden rotate-[-8deg] self-center rounded-full border-2 border-dashed px-3 py-2 text-center font-mono text-[0.6rem] uppercase leading-tight tracking-[0.15em] sm:block"
                    style={{ borderColor: "rgba(31,59,46,0.45)" }}
                  >
                    {issuedLabel}
                    <br />
                    <span className="font-bold">valid 24h</span>
                  </div>

                  <div className="flex flex-col items-end md:items-center">
                    <div className="flex h-12 items-stretch gap-[2px] md:h-14">
                      {BARS.map((w, i) => (
                        <span
                          // biome-ignore lint/suspicious/noArrayIndexKey: static barcode
                          key={i}
                          style={{
                            width: `${w}px`,
                            background: i % 2 ? "transparent" : PINE,
                            opacity: 0.85,
                          }}
                        />
                      ))}
                    </div>
                    <p className="mt-1.5 font-mono text-[0.6rem] tracking-[0.3em] opacity-60">
                      No. {serial}
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke={PINE}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M3 3l18 18" />}
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 animate-spin"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
