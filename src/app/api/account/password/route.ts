import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getPasswordHash, updateUserPasswordHash } from "@/lib/users";

/** 비밀번호 변경: 현재 비밀번호를 확인한 뒤에만 교체한다. */
export async function POST(req: Request) {
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

  const currentPassword = String(body.currentPassword ?? "");
  const newPassword = String(body.newPassword ?? "");

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "WEAK_PASSWORD" }, { status: 400 });
  }
  if (newPassword === currentPassword) {
    return NextResponse.json({ error: "SAME_PASSWORD" }, { status: 400 });
  }

  const passwordHash = await getPasswordHash(current.sub);
  if (!passwordHash) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const ok = await verifyPassword(currentPassword, passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "CURRENT_PASSWORD_INVALID" },
      { status: 400 },
    );
  }

  await updateUserPasswordHash(current.sub, await hashPassword(newPassword));
  return NextResponse.json({ ok: true });
}
