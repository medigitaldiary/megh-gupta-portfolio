"use server";

import { cookies } from "next/headers";
import {
  checkPassword,
  createPass,
  isConfigured,
  PASS_COOKIE,
  safeNextPath,
} from "@/lib/preview-auth";

export type UnlockState =
  | { status: "idle" }
  | { status: "denied"; attempt: number }
  | { status: "unconfigured" }
  | { status: "admitted"; next: string; expiresAt: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function unlock(
  prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  if (!isConfigured()) return { status: "unconfigured" };

  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!(await checkPassword(password))) {
    // Speed bump: makes scripted guessing painfully slow.
    await sleep(600);
    const attempt = prev.status === "denied" ? prev.attempt + 1 : 1;
    return { status: "denied", attempt };
  }

  const pass = await createPass();
  const jar = await cookies();
  jar.set(PASS_COOKIE, pass.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: pass.expires,
  });

  // The client plays the "ADMITTED" animation, then navigates.
  return { status: "admitted", next, expiresAt: pass.expires.toISOString() };
}
