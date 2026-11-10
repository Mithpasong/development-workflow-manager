"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ProjectListItem } from "@/lib/projects";

export default function ProjectsMenu({
  projects,
}: {
  projects: ProjectListItem[];
}) {
  const t = useTranslations("Dashboard");
  const [open, setOpen] = useState(true);

  // 프로젝트가 없으면 드롭다운 대신 New Project 버튼
  if (projects.length === 0) {
    return (
      <button
        type="button"
        className="mt-1 flex items-center justify-center gap-1 rounded-lg border border-dashed border-black/20 px-3 py-2 text-sm font-medium text-black/60 transition hover:border-foreground hover:text-foreground dark:border-white/20 dark:text-white/60"
      >
        <span aria-hidden="true">+</span>
        {t("newProject")}
      </button>
    );
  }

  // 프로젝트가 있으면 드롭다운으로 목록 표시
  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-black/70 transition hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
      >
        <span>{t("projects")}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul className="mt-1 flex flex-col gap-1 pl-3">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="w-full truncate rounded-lg px-3 py-1.5 text-left text-sm text-black/60 transition hover:bg-black/5 hover:text-foreground dark:text-white/60 dark:hover:bg-white/10"
                title={p.name}
              >
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
