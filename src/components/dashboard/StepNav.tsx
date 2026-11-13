"use client";

import { useTranslations } from "next-intl";

// SidebarNav/ProjectNav와 동일한 스타일 — 접힘 시 라벨만 숨기고 번호는 유지한다.
const itemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-black/70 transition hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10 group-data-[collapsed=true]/sidebar:justify-center";

const labelClass = "truncate group-data-[collapsed=true]/sidebar:hidden";

// 번호를 아이콘과 같은 고정폭(size-4) 자리에 두어 다른 메뉴와 정렬을 맞춘다.
const numberClass =
  "flex size-4 shrink-0 items-center justify-center text-[11px] font-semibold tabular-nums text-black/40 dark:text-white/40";

const sectionLabelClass =
  "mb-1 block px-0.5 text-[10px] font-medium uppercase tracking-wide text-black/40 dark:text-white/40 group-data-[collapsed=true]/sidebar:hidden";

export default function StepNav() {
  const t = useTranslations("Dashboard");

  const steps = [
    { no: 1, label: t("menuBackground") },
    { no: 2, label: t("menuProposal") },
  ];

  return (
    <nav className="mt-3 flex flex-col gap-1">
      <span className={sectionLabelClass}>{t("stepLabel")}</span>

      {/* UI 전용 — 기능 미구현 placeholder */}
      {steps.map((step) => (
        <button
          key={step.no}
          type="button"
          className={itemClass}
          title={`${step.no}. ${step.label}`}
        >
          <span className={numberClass}>{step.no}</span>
          <span className={labelClass}>{step.label}</span>
        </button>
      ))}
    </nav>
  );
}
