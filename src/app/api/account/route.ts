import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { signAccessToken } from "@/lib/auth/jwt";
import { setAccessCookie } from "@/lib/auth/cookies";
import { updateUserName } from "@/lib/users";

/** 계정 정보 수정. 이메일은 변경할 수 없고 이름만 수정한다. */
export async function PATCH(req: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "NAME_REQUIRED" }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json({ error: "NAME_TOO_LONG" }, { status: 400 });
  }

  const updated = await updateUserName(current.sub, name);
  if (!updated) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  // 이름은 액세스 토큰(JWT)에 담겨 헤더 등에 쓰이므로, 토큰을 재발급해 즉시 동기화한다.
  const accessToken = await signAccessToken({
    sub: updated.id,
    email: updated.email,
    name: updated.name,
    sid: current.sid,
  });

  const res = NextResponse.json({ user: updated });
  setAccessCookie(res, accessToken);
  return res;
}
