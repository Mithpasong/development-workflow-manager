"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export default function NewDocumentButton({
  projectId,
  step,
}: {
  projectId: string;
  step: string;
}) {
  const t = useTranslations("Documents");
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  async function onCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, step, title: t("untitled") }),
      });
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as {
          document?: { id?: string };
        } | null;
        const id = data?.document?.id;
        toast(t("created"));
        // 새 문서를 바로 선택
        router.push(id ? `?doc=${id}` : "?");
        router.refresh();
        return;
      }
      toast(t("errorCreate"));
    } catch {
      toast(t("errorNetwork"));
    } finally {
      setCreating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onCreate}
      disabled={creating}
      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-black/20 px-3 py-2 text-sm font-medium text-black/60 transition hover:border-foreground hover:bg-black/[0.03] hover:text-foreground disabled:opacity-50 dark:border-white/20 dark:text-white/60 dark:hover:bg-white/5"
    >
      <span aria-hidden="true">+</span>
      {t("newDocument")}
    </button>
  );
}
