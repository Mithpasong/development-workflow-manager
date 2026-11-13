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
      data-collapsed={collapsed ? "true" : "false"}
      className={`group/sidebar relative z-10 flex shrink-0 flex-col border-r border-black/10 p-2 transition-[width] duration-200 dark:border-white/10 ${
        collapsed ? "w-14" : "w-56"
      }`}
    >
      {/*
        토글 버튼: 우측 경계선 위에 걸치도록 배치(-right-3 + size-6 → 선 중앙).
        테두리/배경/그림자를 넣어 버튼처럼 보이게 한다.
        세로 위치는 첫 번째 메뉴 행(Account)의 중심(26px)에 맞춘다.
      */}
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-expanded={!collapsed}
        title={label}
        className="absolute -right-3 top-3.5 z-20 flex size-6 items-center justify-center rounded-full border border-black/15 bg-background text-black/50 shadow-sm transition hover:border-black/30 hover:text-foreground dark:border-white/20 dark:text-white/50 dark:hover:border-white/40"
      >
        {collapsed ? (
          <ChevronRightIcon className="size-3.5" />
        ) : (
          <ChevronLeftIcon className="size-3.5" />
        )}
      </button>

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </aside>
  );
}
