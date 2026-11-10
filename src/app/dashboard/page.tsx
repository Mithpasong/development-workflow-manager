import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        {t("welcome", { name: user?.name ?? "" })}
      </p>
    </div>
  );
}
