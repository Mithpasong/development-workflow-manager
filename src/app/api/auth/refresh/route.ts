import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signAccessToken } from "@/lib/auth/jwt";
import { consumeRefreshToken, issueRefreshToken } from "@/lib/auth/refresh";
import {
  isActiveSession,
  setActiveSession,
} from "@/lib/auth/activeSession";
import {
  setAuthCookies,
  clearAuthCookies,
  REFRESH_COOKIE,
} from "@/lib/auth/cookies";

export async function POST() {
  const store = await cookies();
  const token = store.get(REFRESH_COOKIE)?.value;

  const unauthorized = () => {
    const res = NextResponse.json(
      { error: "INVALID_REFRESH" },
      { status: 401 },
    );
    clearAuthCookies(res);
    return res;
  };

  if (!token) return unauthorized();

  // 토큰 검증 + 소비(회전을 위해 기존 토큰 무효화)
  const record = await consumeRefreshToken(token);
  if (!record) return unauthorized();

  // 단일 세션: 이 refresh의 sid가 현재 활성 세션과 다르면(다른 기기에서 재로그인) 거부
  if (!(await isActiveSession(record.userId, record.sid))) return unauthorized();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, record.userId))
    .limit(1);
  if (!user) return unauthorized();

  // 같은 세션(sid)을 유지하며 활성 세션 TTL 갱신
  await setActiveSession(user.id, record.sid);

  const accessToken = await signAccessToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    sid: record.sid,
  });
  const newRefreshToken = await issueRefreshToken(user.id, record.sid); // 회전(rotation)

  const res = NextResponse.json({ ok: true });
  setAuthCookies(res, accessToken, newRefreshToken);
  return res;
}
