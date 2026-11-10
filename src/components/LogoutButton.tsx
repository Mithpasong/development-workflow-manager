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
      className="h-11 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
    >
      {t("logout")}
    </button>
  );
}
