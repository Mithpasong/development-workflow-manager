"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

function itemClass(active: boolean) {
  return `rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
    active
      ? "bg-foreground text-background"
      : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
  }`;
}

export default function SidebarNav() {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");

  return (
    <nav className="flex flex-col gap-1">
      {/* 섹션 1 */}
      <Link
        href="/dashboard"
        aria-current={pathname === "/dashboard" ? "page" : undefined}
        className={itemClass(pathname === "/dashboard")}
      >
        {t("menuDashboard")}
      </Link>

      {/* 섹션 구분선 */}
      <hr className="my-2 border-black/10 dark:border-white/10" />

      {/* 섹션 2 (UI 전용 — 기능 미구현 placeholder) */}
      <button type="button" className={itemClass(false)}>
        {t("menuAccount")}
      </button>
      <button type="button" className={itemClass(false)}>
        {t("menuNotification")}
      </button>
    </nav>
  );
}
