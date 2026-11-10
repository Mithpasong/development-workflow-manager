"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { setLocale } from "@/i18n/actions";
import { locales, type Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
  const active = useLocale();
  const t = useTranslations("Language");
  const [isPending, startTransition] = useTransition();

  function handleChange(next: Locale) {
    if (next === active) return;
    startTransition(() => {
      setLocale(next);
    });
  }

  const labels: Record<Locale, string> = {
    ko: t("korean"),
    en: t("english"),
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex items-center gap-0.5 rounded-full border border-black/10 p-0.5 text-xs dark:border-white/15"
    >
      {locales.map((loc) => {
        const isActive = loc === active;
        return (
          <button
            key={loc}
            type="button"
            aria-pressed={isActive}
            disabled={isPending}
            onClick={() => handleChange(loc)}
            className={`rounded-full px-3 py-1 font-medium transition disabled:opacity-60 ${
              isActive
                ? "bg-foreground text-background"
                : "text-black/60 hover:text-foreground dark:text-white/60"
            }`}
          >
            {labels[loc]}
          </button>
        );
      })}
    </div>
  );
}
