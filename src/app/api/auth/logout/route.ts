import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeRefreshToken } from "@/lib/auth/refresh";
import { clearAuthCookies, REFRESH_COOKIE } from "@/lib/auth/cookies";

export async function POST() {
  const store = await cookies();
  const token = store.get(REFRESH_COOKIE)?.value;
  if (token) await revokeRefreshToken(token);

  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}
