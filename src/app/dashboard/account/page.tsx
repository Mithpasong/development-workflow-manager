import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getAccountById } from "@/lib/users";
import AccountProfileForm from "@/components/account/AccountProfileForm";
import AccountPasswordForm from "@/components/account/AccountPasswordForm";

export default async function AccountPage() {
  const current = await getCurrentUser();
  if (!current) redirect("/");

  const account = await getAccountById(current.sub);
  if (!account) redirect("/");

  const t = await getTranslations("Account");
  const locale = await getLocale();
  const joined = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(account.createdAt);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-black/50 dark:text-white/50">
        {t("subtitle")}
      </p>

      {/* 계정 정보 */}
      <section className="mt-8">
        <h2 className="text-base font-semibold">{t("profileTitle")}</h2>
        <p className="mt-1 text-xs text-black/40 dark:text-white/40">
          {t("joinedAt", { date: joined })}
        </p>
        <div className="mt-4">
          <AccountProfileForm
            email={account.email}
            initialName={account.name}
          />
        </div>
      </section>

      <hr className="my-10 border-black/10 dark:border-white/10" />

      {/* 비밀번호 변경 */}
      <section>
        <h2 className="text-base font-semibold">{t("passwordTitle")}</h2>
        <p className="mt-1 text-xs text-black/40 dark:text-white/40">
          {t("passwordHelp")}
        </p>
        <div className="mt-4">
          <AccountPasswordForm />
        </div>
      </section>
    </div>
  );
}
