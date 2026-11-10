"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type PolicyModalProps = {
  open: boolean;
  title: string;
  body: string;
  agreeLabel: string;
  closeLabel: string;
  onAgree: () => void;
  onClose: () => void;
};

export default function PolicyModal({
  open,
  title,
  body,
  agreeLabel,
  closeLabel,
  onAgree,
  onClose,
}: PolicyModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* 백드롭 */}
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40"
        tabIndex={-1}
      />

      {/* 다이얼로그 */}
      <div className="relative z-10 flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-black/10 bg-background shadow-xl dark:border-white/15">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-mr-1 flex size-8 items-center justify-center rounded-md text-black/40 transition hover:text-foreground dark:text-white/40"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="size-5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 text-sm leading-relaxed text-black/70 dark:text-white/70">
          {body}
        </div>

        <div className="flex justify-end gap-2 border-t border-black/10 px-5 py-4 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-black/15 px-4 text-sm font-medium transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            {closeLabel}
          </button>
          <button
            type="button"
            onClick={onAgree}
            autoFocus
            className="h-10 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90"
          >
            {agreeLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
