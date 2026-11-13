"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

// SidebarNav/ProjectNav와 동일한 스타일 — 접힘 시 라벨만 숨기고 번호는 유지한다.
const itemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-black/70 transition hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10 group-data-[collapsed=true]/sidebar:justify-center";

const activeItemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium bg-foreground text-background transition group-data-[collapsed=true]/sidebar:justify-center";

const labelClass = "truncate group-data-[collapsed=true]/sidebar:hidden";

// 번호를 아이콘과 같은 고정폭(size-4) 자리에 두어 다른 메뉴와 정렬을 맞춘다.
const numberClass =
  "flex size-4 shrink-0 items-center justify-center text-[11px] font-semibold tabular-nums text-black/40 dark:text-white/40";

const sectionLabelClass =
  "mb-1 block px-0.5 text-[10px] font-medium uppercase tracking-wide text-black/40 dark:text-white/40 group-data-[collapsed=true]/sidebar:hidden";

export default function StepNav() {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();

  const steps = [
    { no: 1, label: t("menuBackground"), href: "/dashboard/background" },
    // Proposal은 아직 화면이 없어 링크 없이 placeholder로 둔다.
    { no: 2, label: t("menuProposal"), href: null },
  ];

  return (
    <nav className="mt-3 flex flex-col gap-1">
      <span className={sectionLabelClass}>{t("stepLabel")}</span>

      {steps.map((step) => {
        const title = `${step.no}. ${step.label}`;
        const body = (
          <>
            <span className={numberClass}>{step.no}</span>
            <span className={labelClass}>{step.label}</span>
          </>
        );

        if (!step.href) {
          return (
            <button
              key={step.no}
              type="button"
              className={itemClass}
              title={title}
            >
              {body}
            </button>
          );
        }

        const active = pathname === step.href;
        return (
          <Link
            key={step.no}
            href={step.href}
            aria-current={active ? "page" : undefined}
            className={active ? activeItemClass : itemClass}
            title={title}
          >
            {body}
          </Link>
        );
      })}
    </nav>
  );
}
