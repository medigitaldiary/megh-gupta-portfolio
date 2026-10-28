import { type NextRequest, NextResponse } from "next/server";
import { PASS_COOKIE, verifyPass } from "@/lib/preview-auth";

/**
 * The bouncer. Runs on the server before any experiment page is sent.
 * No valid 24h pass → redirect to the Backstage Pass screen at /unlock.
 * Because this happens before rendering, locked pages never reach the
 * browser (a UI-only lock would still ship the HTML).
 */
export async function middleware(req: NextRequest) {
  const pass = req.cookies.get(PASS_COOKIE)?.value;

  if (await verifyPass(pass)) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = "";
  url.searchParams.set("next", `${req.nextUrl.pathname}${req.nextUrl.search}`);
  return NextResponse.redirect(url);
}

// Must mirror PROTECTED_PREFIXES in lib/preview-auth.ts.
export const config = {
  matcher: [
    "/preview",
    "/preview/:path*",
    "/paper-preview",
    "/paper-preview/:path*",
    "/work",
    "/work/:path*",
  ],
};
