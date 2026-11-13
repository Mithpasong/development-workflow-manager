import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createDocument, isProjectOwnedBy } from "@/lib/documents";

/** 문서 생성 */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const projectId = String(body.projectId ?? "");
  const step = String(body.step ?? "").trim();
  const title = String(body.title ?? "").trim();

  if (!projectId || !step) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: "TITLE_REQUIRED" }, { status: 400 });
  }
  if (title.length > 200) {
    return NextResponse.json({ error: "TITLE_TOO_LONG" }, { status: 400 });
  }

  // 다른 사용자의 프로젝트에 문서를 만들지 못하도록 소유권 확인
  if (!(await isProjectOwnedBy(projectId, user.sub))) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const document = await createDocument(projectId, step, title);
  return NextResponse.json({ document }, { status: 201 });
}
