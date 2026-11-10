"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useTransitionRouter } from "next-view-transitions";

export default function LogoutButton() {
  const t = useTranslations("Dashboard");
  const router = useTransitionRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
    }
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="h-6 rounded-md border border-black/15 px-2 text-[11px] font-medium text-black/60 transition hover:bg-black/5 hover:text-foreground disabled:opacity-60 dark:border-white/15 dark:text-white/60 dark:hover:bg-white/10"
    >
      {t("logout")}
    </button>
  );
}
