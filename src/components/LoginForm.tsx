"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTransitionRouter } from "next-view-transitions";

const inputClass =
  "h-11 rounded-lg border border-black/15 bg-background px-3.5 text-sm outline-none transition placeholder:text-black/30 focus:border-foreground focus:ring-2 focus:ring-foreground/15 dark:border-white/15 dark:placeholder:text-white/30";
const labelClass = "text-sm font-medium text-black/70 dark:text-white/70";

export default function LoginForm() {
  const t = useTranslations("Login");
  const router = useTransitionRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/dashboard");
        return;
      }
      setError(t("errorInvalidCredentials"));
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {/* ID (이메일) */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>
          {t("emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t("emailPlaceholder")}
          className={inputClass}
        />
      </div>

      {/* PASSWORD */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className={labelClass}>
          {t("passwordLabel")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder={t("passwordPlaceholder")}
          className={inputClass}
        />
      </div>

      {/* 비밀번호 찾기 */}
      <div className="flex justify-end">
        <button
          type="button"
          className="text-xs text-black/50 underline-offset-4 hover:text-foreground hover:underline dark:text-white/50"
        >
          {t("forgotPassword")}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={submitting}
        className="h-11 rounded-lg bg-foreground text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
      >
        {t("submit")}
      </button>
    </form>
  );
}
