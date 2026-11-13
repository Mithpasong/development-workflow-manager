"use client";

import { useTranslations } from "next-intl";

// SidebarNav와 동일한 스타일 — 접힘 시 아이콘만 보이도록 텍스트를 숨기고 가운데 정렬한다.
const itemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-black/70 transition hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10 group-data-[collapsed=true]/sidebar:justify-center";

const iconClass = "size-4 shrink-0";

const labelClass = "truncate group-data-[collapsed=true]/sidebar:hidden";

function GridIcon({ className }: { className?: string }) {
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
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function ProjectNav() {
  const t = useTranslations("Dashboard");

  return (
    <nav className="mt-2 flex flex-col gap-1">
      {/* UI 전용 — 기능 미구현 placeholder */}
      <button type="button" className={itemClass} title={t("menuOverview")}>
        <GridIcon className={iconClass} />
        <span className={labelClass}>{t("menuOverview")}</span>
      </button>
      <button type="button" className={itemClass} title={t("menuSettings")}>
        <GearIcon className={iconClass} />
        <span className={labelClass}>{t("menuSettings")}</span>
      </button>
      <button
        type="button"
        className={itemClass}
        title={t("menuCollaborators")}
      >
        <UsersIcon className={iconClass} />
        <span className={labelClass}>{t("menuCollaborators")}</span>
      </button>
    </nav>
  );
}
