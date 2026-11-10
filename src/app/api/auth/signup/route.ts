import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth/password";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const name = String(body.name ?? "").trim();
  const agreePrivacy = Boolean(body.agreePrivacy);
  const agreeTerms = Boolean(body.agreeTerms);

  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  if (password.length < 8)
    return NextResponse.json({ error: "WEAK_PASSWORD" }, { status: 400 });
  if (!name)
    return NextResponse.json({ error: "NAME_REQUIRED" }, { status: 400 });
  if (!agreePrivacy || !agreeTerms)
    return NextResponse.json({ error: "AGREEMENT_REQUIRED" }, { status: 400 });

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length > 0)
    return NextResponse.json({ error: "EMAIL_TAKEN" }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const [created] = await db
    .insert(users)
    .values({ email, passwordHash, name })
    .returning({ id: users.id, email: users.email, name: users.name });

  return NextResponse.json({ user: created }, { status: 201 });
}
