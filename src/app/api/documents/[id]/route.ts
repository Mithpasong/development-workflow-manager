import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getDocumentForUser, updateDocument } from "@/lib/documents";

/** 문서 수정(제목/본문) */
export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/documents/[id]">,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await ctx.params;

  // 소유권 확인을 겸한 조회
  const existing = await getDocumentForUser(id, user.sub);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "");

  if (!title) {
    return NextResponse.json({ error: "TITLE_REQUIRED" }, { status: 400 });
  }
  if (title.length > 200) {
    return NextResponse.json({ error: "TITLE_TOO_LONG" }, { status: 400 });
  }

  await updateDocument(id, { title, content });
  return NextResponse.json({ ok: true });
}
