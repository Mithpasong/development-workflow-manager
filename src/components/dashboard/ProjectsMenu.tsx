"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import NewProjectModal from "@/components/dashboard/NewProjectModal";
import { selectProjectAction } from "@/lib/projects-actions";
import type { ProjectListItem } from "@/lib/projects";

export default function ProjectsMenu({
  projects,
  selectedId,
}: {
  projects: ProjectListItem[];
  selectedId: string | null;
}) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function selectProject(id: string) {
    await selectProjectAction(id);
    router.refresh();
  }

  return (
    <div className="mt-1">
      {/* 드롭다운 헤더 */}
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
        <div className="mt-1 flex flex-col gap-1 pl-3">
          {/* 프로젝트 목록 */}
          {projects.map((p) => {
            const active = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectProject(p.id)}
                aria-current={active ? "true" : undefined}
                className={`w-full truncate rounded-lg px-3 py-1.5 text-left text-sm transition ${
                  active
                    ? "bg-foreground text-background"
                    : "text-black/60 hover:bg-black/5 hover:text-foreground dark:text-white/60 dark:hover:bg-white/10"
                }`}
                title={p.name}
              >
                {p.name}
              </button>
            );
          })}

          {/* New Project 버튼 (상시) */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-black/20 px-3 py-1.5 text-sm font-medium text-black/60 transition hover:border-foreground hover:text-foreground dark:border-white/20 dark:text-white/60"
          >
            <span aria-hidden="true">+</span>
            {t("newProject")}
          </button>
        </div>
      )}

      {modalOpen && (
        <NewProjectModal
          onClose={() => setModalOpen(false)}
          onCreated={(id) => {
            // 새로 만든 프로젝트를 선택 상태로
            if (id) selectProject(id);
            else router.refresh();
          }}
        />
      )}
    </div>
  );
}
