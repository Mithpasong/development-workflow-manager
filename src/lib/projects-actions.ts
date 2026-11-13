"use server";

import { cookies } from "next/headers";
import { SELECTED_PROJECT_COOKIE } from "@/lib/projects";

/** 현재 선택된 프로젝트를 쿠키에 저장한다. */
export async function selectProjectAction(projectId: string): Promise<void> {
  const store = await cookies();
  store.set(SELECTED_PROJECT_COOKIE, projectId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
