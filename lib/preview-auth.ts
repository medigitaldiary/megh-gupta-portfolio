/**
 * Preview lock — the "backstage pass".
 *
 * Experiment routes (/preview/*, /paper-preview, /work/*) are gated by
 * middleware.ts. A visitor who types the right password at /unlock gets a
 * signed cookie that is valid for 24 hours.
 *
 * Pass format:  `<expiryUnixSeconds>.<base64url HMAC-SHA256>`
 * The HMAC key is PREVIEW_SECRET + PREVIEW_PASSWORD, so:
 *   - editing the expiry breaks the signature (can't extend a pass), and
 *   - changing the password instantly revokes every pass already issued.
 *
 * Web Crypto only (no node:crypto) so this runs in both the Edge
 * middleware and Node server actions.
 */

export const PASS_COOKIE = "mg_backstage_pass";
export const PASS_TTL_SECONDS = 60 * 60 * 24; // 24 hours

// Route prefixes that require a pass. Middleware's `config.matcher` must
// mirror this list (Next needs the matcher to be a static literal).
export const PROTECTED_PREFIXES = ["/preview", "/paper-preview", "/work"];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/** Only allow redirects back to a protected, same-origin path. */
export function safeNextPath(raw: unknown): string {
  if (typeof raw !== "string") return "/preview";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return "/preview";
  }
  const pathOnly = raw.split(/[?#]/)[0];
  return isProtectedPath(pathOnly) ? raw : "/preview";
}

export function isConfigured(): boolean {
  return Boolean(process.env.PREVIEW_PASSWORD && process.env.PREVIEW_SECRET);
}

const encoder = new TextEncoder();

function toBase64Url(buf: ArrayBuffer): string {
  let bin = "";
  for (const b of new Uint8Array(buf)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(message: string): Promise<string> {
  const secret = process.env.PREVIEW_SECRET ?? "";
  const password = process.env.PREVIEW_PASSWORD ?? "";
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`${secret}:${password}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toBase64Url(sig);
}

/** Constant-time string comparison (avoids leaking how many chars match). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Compare a typed password to PREVIEW_PASSWORD without timing leaks. */
export async function checkPassword(input: string): Promise<boolean> {
  if (!isConfigured()) return false;
  // HMAC both sides so the compared strings are always equal length.
  const [a, b] = await Promise.all([
    hmac(`pw:${input}`),
    hmac(`pw:${process.env.PREVIEW_PASSWORD}`),
  ]);
  return safeEqual(a, b);
}

export async function createPass(): Promise<{ value: string; expires: Date }> {
  const exp = Math.floor(Date.now() / 1000) + PASS_TTL_SECONDS;
  const sig = await hmac(`pass:v1:${exp}`);
  return { value: `${exp}.${sig}`, expires: new Date(exp * 1000) };
}

export async function verifyPass(value: string | undefined): Promise<boolean> {
  if (!value || !isConfigured()) return false;
  const [expRaw, sig] = value.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || !sig) return false;
  if (exp * 1000 <= Date.now()) return false; // expired
  const expected = await hmac(`pass:v1:${exp}`);
  return safeEqual(sig, expected);
}
