import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signAccessToken } from "@/lib/auth/jwt";
import { consumeRefreshToken, issueRefreshToken } from "@/lib/auth/refresh";
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
  const userId = await consumeRefreshToken(token);
  if (!userId) return unauthorized();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) return unauthorized();

  const accessToken = await signAccessToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });
  const newRefreshToken = await issueRefreshToken(user.id); // 회전(rotation)

  const res = NextResponse.json({ ok: true });
  setAuthCookies(res, accessToken, newRefreshToken);
  return res;
}
