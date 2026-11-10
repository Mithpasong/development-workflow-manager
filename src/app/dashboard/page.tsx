import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const t = await getTranslations("Dashboard");

  return (
    <main className="relative flex flex-1 items-center justify-center p-6">
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          {t("welcome", { name: user.name })}
        </p>

        <dl className="mt-6 flex flex-col gap-3 rounded-xl border border-black/10 p-5 text-sm dark:border-white/15">
          <div className="flex justify-between gap-4">
            <dt className="text-black/50 dark:text-white/50">{t("name")}</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-black/50 dark:text-white/50">{t("email")}</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
