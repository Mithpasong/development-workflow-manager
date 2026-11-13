"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { setSidebarCollapsedAction } from "@/lib/ui-actions";

function ChevronLeftIcon({ className }: { className?: string }) {
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
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
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
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default function DashboardSidebar({
  initialCollapsed,
  children,
}: {
  initialCollapsed: boolean;
  children: React.ReactNode;
}) {
  const t = useTranslations("Dashboard");
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next); // 즉시 반영
    void setSidebarCollapsedAction(next); // 쿠키에 저장(새로고침 유지)
  }

  const label = collapsed ? t("expandSidebar") : t("collapseSidebar");

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-r border-black/10 p-2 transition-[width] duration-200 dark:border-white/10 ${
        collapsed ? "w-12 items-center" : "w-56"
      }`}
    >
      {/*
        펼침: 흐름에서 빼 우측 상단에 겹쳐 배치하고 높이를 메뉴 한 줄(h-9)과 맞춰
              첫 번째 항목(Account)과 세로 중심이 일치하게 한다.
        접힘: 흐름 안에서 가운데 정렬.
      */}
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-expanded={!collapsed}
        title={label}
        className={`flex h-9 shrink-0 items-center justify-center rounded-md text-black/45 transition hover:bg-black/5 hover:text-foreground dark:text-white/45 dark:hover:bg-white/10 ${
          collapsed ? "w-full" : "absolute right-2 top-2 z-10 w-7"
        }`}
      >
        {collapsed ? (
          <ChevronRightIcon className="size-4" />
        ) : (
          <ChevronLeftIcon className="size-4" />
        )}
      </button>

      {!collapsed && (
        <div className="flex min-h-0 flex-1 flex-col px-1">{children}</div>
      )}
    </aside>
  );
}
