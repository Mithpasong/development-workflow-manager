import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { consumeRefreshToken } from "@/lib/auth/refresh";
import { clearActiveSession } from "@/lib/auth/activeSession";
import { clearAuthCookies, REFRESH_COOKIE } from "@/lib/auth/cookies";

export async function POST() {
  const store = await cookies();
  const token = store.get(REFRESH_COOKIE)?.value;
  if (token) {
    // refresh 토큰 무효화 + 해당 사용자의 활성 세션 제거
    const record = await consumeRefreshToken(token);
    if (record) await clearActiveSession(record.userId);
  }

  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}
