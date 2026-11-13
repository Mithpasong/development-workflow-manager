"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

const inputClass =
  "h-11 w-full rounded-lg border border-black/15 bg-background px-3.5 text-sm outline-none transition placeholder:text-black/30 focus:border-foreground focus:ring-2 focus:ring-foreground/15 dark:border-white/15 dark:placeholder:text-white/30";
const labelClass = "text-sm font-medium text-black/70 dark:text-white/70";

const SERVER_ERROR_KEYS: Record<string, string> = {
  NAME_REQUIRED: "errorNameRequired",
  NAME_TOO_LONG: "errorNameTooLong",
};

export default function AccountProfileForm({
  email,
  initialName,
}: {
  email: string;
  initialName: string;
}) {
  const t = useTranslations("Account");
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setError(t("errorNameRequired"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (res.ok) {
        toast(t("profileUpdated"));
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      const code = typeof data?.error === "string" ? data.error : "";
      setError(t(SERVER_ERROR_KEYS[code] ?? "errorGeneric"));
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* 이메일 — 수정 불가 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="accountEmail" className={labelClass}>
          {t("emailLabel")}
        </label>
        <input
          id="accountEmail"
          type="email"
          value={email}
          readOnly
          disabled
          className={`${inputClass} cursor-not-allowed bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/50`}
        />
        <p className="text-xs text-black/40 dark:text-white/40">
          {t("emailHelp")}
        </p>
      </div>

      {/* 이름 — 수정 가능 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="accountName" className={labelClass}>
          {t("nameLabel")}
        </label>
        <input
          id="accountName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          autoComplete="name"
          className={inputClass}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={submitting || name.trim() === initialName}
          className="h-10 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {t("save")}
        </button>
      </div>
    </form>
  );
}
