"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import "@uiw/react-md-editor/markdown-editor.css";

// 에디터는 브라우저 API에 의존하므로 클라이언트에서만 로드한다.
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-80 animate-pulse rounded-lg bg-black/5 dark:bg-white/10" />
  ),
});

export default function DocumentEditor({
  documentId,
  initialTitle,
  initialContent,
}: {
  documentId: string;
  initialTitle: string;
  initialContent: string;
}) {
  const t = useTranslations("Documents");
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave() {
    setError(null);
    const trimmed = title.trim();
    if (!trimmed) {
      setError(t("errorTitleRequired"));
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed, content }),
      });
      if (res.ok) {
        toast(t("saved"));
        router.refresh();
        return;
      }
      setError(t("errorSave"));
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* 제목 + 저장 */}
      <div className="flex items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          aria-label={t("documentTitle")}
          className="h-10 flex-1 rounded-lg border border-black/15 bg-background px-3 text-sm font-medium outline-none transition focus:border-foreground focus:ring-2 focus:ring-foreground/15 dark:border-white/15"
        />
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="h-10 shrink-0 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {t("save")}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {/* 마크다운 에디터 (툴바 + 미리보기) */}
      <div data-color-mode="light" className="min-h-0 flex-1">
        <MDEditor
          value={content}
          onChange={(v) => setContent(v ?? "")}
          height={520}
          preview="live"
        />
      </div>
    </div>
  );
}
