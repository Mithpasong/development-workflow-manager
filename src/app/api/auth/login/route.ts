import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { issueRefreshToken } from "@/lib/auth/refresh";
import { setAuthCookies } from "@/lib/auth/cookies";

// 사용자가 없을 때도 비슷한 시간이 걸리도록 비교에 쓰는 더미 해시(계정 열거 완화).
const DUMMY_HASH =
  "$2b$10$H9ZI0Vl.eKyXpHfLc3Lhm.PwwFl/6DkWsYPvVJm8isoCZGMXaDesC";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password)
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    await verifyPassword(password, DUMMY_HASH);
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok)
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });

  const accessToken = await signAccessToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });
  const refreshToken = await issueRefreshToken(user.id);

  const res = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
  });
  setAuthCookies(res, accessToken, refreshToken);
  return res;
}
