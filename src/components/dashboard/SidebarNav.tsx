"use client";

import { useTranslations } from "next-intl";

const itemClass =
  "rounded-lg px-3 py-2 text-left text-sm font-medium text-black/70 transition hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10";

export default function SidebarNav() {
  const t = useTranslations("Dashboard");

  return (
    <nav className="flex flex-col gap-1">
      {/* UI 전용 — 기능 미구현 placeholder */}
      <button type="button" className={itemClass}>
        {t("menuAccount")}
      </button>
      <button type="button" className={itemClass}>
        {t("menuNotification")}
      </button>
    </nav>
  );
}
