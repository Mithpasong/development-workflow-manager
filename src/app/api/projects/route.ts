import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createProject } from "@/lib/projects";

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

  const project = await createProject(user.sub, name);
  return NextResponse.json({ project }, { status: 201 });
}
