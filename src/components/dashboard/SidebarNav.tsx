"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SidebarNav() {
  const pathname = usePathname();
  const t = useTranslations("Dashboard");

  const items = [{ href: "/dashboard", label: t("menuDashboard") }];

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-foreground text-background"
                : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
