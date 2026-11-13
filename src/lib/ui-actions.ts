"use server";

import { cookies } from "next/headers";
import { SIDEBAR_COLLAPSED_COOKIE } from "@/lib/ui-preferences";

/** 사이드바 접힘 상태를 쿠키에 저장한다(새로고침 후에도 유지). */
export async function setSidebarCollapsedAction(
  collapsed: boolean,
): Promise<void> {
  const store = await cookies();
  store.set(SIDEBAR_COLLAPSED_COOKIE, collapsed ? "1" : "0", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
