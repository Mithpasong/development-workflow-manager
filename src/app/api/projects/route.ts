import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createProject,
  isProjectNameTaken,
  isUniqueViolation,
} from "@/lib/projects";

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

  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "NAME_REQUIRED" }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json({ error: "NAME_TOO_LONG" }, { status: 400 });
  }

  // 프로젝트명은 전역 유일 — 먼저 확인하고, 동시 요청 대비로 유니크 위반도 처리한다.
  if (await isProjectNameTaken(name)) {
    return NextResponse.json({ error: "NAME_TAKEN" }, { status: 409 });
  }

  try {
    const project = await createProject(user.sub, name);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ error: "NAME_TAKEN" }, { status: 409 });
    }
    throw error;
  }
}
