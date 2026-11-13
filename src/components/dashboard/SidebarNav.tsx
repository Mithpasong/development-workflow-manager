"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

// 접힘(aside의 data-collapsed="true")일 때는 아이콘만 보이도록 텍스트를 숨기고 가운데 정렬한다.
const itemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-black/70 transition hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10 group-data-[collapsed=true]/sidebar:justify-center";

const activeItemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium bg-foreground text-background transition group-data-[collapsed=true]/sidebar:justify-center";

const iconClass = "size-4 shrink-0";

const labelClass = "truncate group-data-[collapsed=true]/sidebar:hidden";

// 섹션 소제목(GENERAL) — PROJECT 레이블과 동일한 스타일, 접힘 시 숨김
const sectionLabelClass =
  "mb-1 block px-0.5 text-[10px] font-medium uppercase tracking-wide text-black/40 dark:text-white/40 group-data-[collapsed=true]/sidebar:hidden";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export default function SidebarNav() {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();
  const accountActive = pathname === "/dashboard/account";

  return (
    <nav className="flex flex-col gap-1">
      <span className={sectionLabelClass}>{t("generalLabel")}</span>

      <Link
        href="/dashboard/account"
        aria-current={accountActive ? "page" : undefined}
        className={accountActive ? activeItemClass : itemClass}
        title={t("menuAccount")}
      >
        <UserIcon className={iconClass} />
        <span className={labelClass}>{t("menuAccount")}</span>
      </Link>

      {/* UI 전용 — 기능 미구현 placeholder */}
      <button type="button" className={itemClass} title={t("menuNotification")}>
        <BellIcon className={iconClass} />
        <span className={labelClass}>{t("menuNotification")}</span>
      </button>
    </nav>
  );
}
