"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

/**
 * 부모가 열릴 때만 마운트한다({open && <NewProjectModal .../>}).
 * 매 오픈마다 새로 마운트되므로 내부 상태(name/error)는 자동으로 초기화된다.
 */
export default function NewProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const t = useTranslations("Dashboard");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t("errorProjectNameRequired"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (res.ok) {
        onCreated();
        onClose();
        return;
      }
      setError(t("errorProjectCreate"));
    } catch {
      setError(t("errorProjectCreate"));
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("newProject")}
    >
      <button
        type="button"
        aria-label={t("cancel")}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40"
        tabIndex={-1}
      />

      <div className="relative z-10 w-full max-w-sm rounded-xl border border-black/10 bg-background p-5 shadow-xl dark:border-white/15">
        <h2 className="text-base font-semibold">{t("newProject")}</h2>

        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
          <label
            htmlFor="projectName"
            className="text-sm font-medium text-black/70 dark:text-white/70"
          >
            {t("projectNameLabel")}
          </label>
          <input
            id="projectName"
            name="projectName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            autoFocus
            placeholder={t("projectNamePlaceholder")}
            className="h-11 rounded-lg border border-black/15 bg-background px-3.5 text-sm outline-none transition placeholder:text-black/30 focus:border-foreground focus:ring-2 focus:ring-foreground/15 dark:border-white/15 dark:placeholder:text-white/30"
          />

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-black/15 px-4 text-sm font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
            >
              {t("create")}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
