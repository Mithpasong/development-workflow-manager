"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import NewProjectModal from "@/components/dashboard/NewProjectModal";
import { selectProjectAction } from "@/lib/projects-actions";
import type { ProjectListItem } from "@/lib/projects";

function ChevronIcon({ className }: { className?: string }) {
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
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function ProjectsMenu({
  projects,
  selectedId,
}: {
  projects: ProjectListItem[];
  selectedId: string | null;
}) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 / Esc 로 닫기
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function selectProject(id: string) {
    setOpen(false);
    await selectProjectAction(id);
    router.refresh();
  }

  const newProjectModal = modalOpen && (
    <NewProjectModal
      onClose={() => setModalOpen(false)}
      onCreated={(id) => {
        if (id) void selectProject(id);
        else router.refresh();
      }}
    />
  );

  // 프로젝트가 없으면 고를 항목이 없으므로 드롭다운 대신 New Project 버튼
  if (projects.length === 0) {
    return (
      <div className="mt-1">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-black/20 px-3 py-2 text-sm font-medium text-black/60 transition hover:border-foreground hover:bg-black/[0.03] hover:text-foreground dark:border-white/20 dark:text-white/60 dark:hover:bg-white/5"
        >
          <PlusIcon className="size-4" />
          {t("newProject")}
        </button>
        {newProjectModal}
      </div>
    );
  }

  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  return (
    <div className="relative mt-1" ref={containerRef}>
      {/* 트리거 */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("projects")}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-black/15 bg-background px-3 text-sm transition hover:bg-black/[0.03] focus:outline-none focus:ring-2 focus:ring-foreground/15 dark:border-white/15 dark:hover:bg-white/5"
      >
        <span className="truncate font-medium" title={selected.name}>
          {selected.name}
        </span>
        <ChevronIcon
          className={`size-4 shrink-0 text-black/40 transition-transform dark:text-white/40 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 펼침 패널 */}
      {open && (
        <div className="absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-black/10 bg-background py-1 shadow-lg shadow-black/5 dark:border-white/15 dark:shadow-black/40">
          <ul role="listbox" className="max-h-60 overflow-auto">
            {projects.map((p) => {
              const active = p.id === selected.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => void selectProject(p.id)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition ${
                      active
                        ? "bg-black/[0.06] font-medium text-foreground dark:bg-white/10"
                        : "text-black/70 hover:bg-black/[0.04] dark:text-white/70 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate" title={p.name}>
                      {p.name}
                    </span>
                    {active && <CheckIcon className="size-4 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="my-1 border-t border-black/10 dark:border-white/10" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setModalOpen(true);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-black/70 transition hover:bg-black/[0.04] hover:text-foreground dark:text-white/70 dark:hover:bg-white/5"
          >
            <PlusIcon className="size-4 shrink-0" />
            {t("newProject")}
          </button>
        </div>
      )}

      {newProjectModal}
    </div>
  );
}
