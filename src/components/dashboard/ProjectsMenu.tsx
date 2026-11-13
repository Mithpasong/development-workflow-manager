"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import NewProjectModal from "@/components/dashboard/NewProjectModal";
import { selectProjectAction } from "@/lib/projects-actions";
import type { ProjectListItem } from "@/lib/projects";

/** select 안에서 "새 프로젝트 만들기"를 나타내는 특수 값 */
const NEW_PROJECT_VALUE = "__new_project__";

export default function ProjectsMenu({
  projects,
  selectedId,
}: {
  projects: ProjectListItem[];
  selectedId: string | null;
}) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  async function selectProject(id: string) {
    await selectProjectAction(id);
    router.refresh();
  }

  // 프로젝트가 없으면 고를 항목이 없으므로 드롭다운 대신 New Project 버튼
  if (projects.length === 0) {
    return (
      <div className="mt-1">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-black/20 px-3 py-2 text-sm font-medium text-black/60 transition hover:border-foreground hover:text-foreground dark:border-white/20 dark:text-white/60"
        >
          <span aria-hidden="true">+</span>
          {t("newProject")}
        </button>

        {modalOpen && (
          <NewProjectModal
            onClose={() => setModalOpen(false)}
            onCreated={(id) => {
              if (id) void selectProject(id);
              else router.refresh();
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mt-1">
      <select
        aria-label={t("projects")}
        value={selectedId ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value === NEW_PROJECT_VALUE) {
            // 선택값은 그대로 두고(제어 컴포넌트) 모달만 연다
            setModalOpen(true);
            return;
          }
          void selectProject(value);
        }}
        className="h-9 w-full rounded-lg border border-black/15 bg-background px-2 text-sm outline-none transition focus:border-foreground focus:ring-2 focus:ring-foreground/15 dark:border-white/15"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
        <option value={NEW_PROJECT_VALUE}>+ {t("newProject")}</option>
      </select>

      {modalOpen && (
        <NewProjectModal
          onClose={() => setModalOpen(false)}
          onCreated={(id) => {
            if (id) void selectProject(id);
            else router.refresh();
          }}
        />
      )}
    </div>
  );
}
