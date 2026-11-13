"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

const inputClass =
  "h-11 w-full rounded-lg border border-black/15 bg-background px-3.5 text-sm outline-none transition placeholder:text-black/30 focus:border-foreground focus:ring-2 focus:ring-foreground/15 dark:border-white/15 dark:placeholder:text-white/30";
const labelClass = "text-sm font-medium text-black/70 dark:text-white/70";

const SERVER_ERROR_KEYS: Record<string, string> = {
  CURRENT_PASSWORD_INVALID: "errorCurrentPasswordInvalid",
  WEAK_PASSWORD: "errorWeakPassword",
  SAME_PASSWORD: "errorSamePassword",
};

export default function AccountPasswordForm() {
  const t = useTranslations("Account");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t("errorAllFieldsRequired"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("errorPasswordMismatch"));
      return;
    }
    if (newPassword.length < 8) {
      setError(t("errorWeakPassword"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        toast(t("passwordChanged"));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
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
      <div className="flex flex-col gap-1.5">
        <label htmlFor="currentPassword" className={labelClass}>
          {t("currentPasswordLabel")}
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="newPassword" className={labelClass}>
          {t("newPasswordLabel")}
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmNewPassword" className={labelClass}>
          {t("confirmNewPasswordLabel")}
        </label>
        <input
          id="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          disabled={submitting}
          className="h-10 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {t("changePassword")}
        </button>
      </div>
    </form>
  );
}
