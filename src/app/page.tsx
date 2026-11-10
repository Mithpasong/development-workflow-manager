import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const t = useTranslations("Login");

  return (
    <main className="relative flex flex-1 items-center justify-center p-6">
      {/* 언어 전환 */}
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm">
        {/* 로고 / 타이틀 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-sm text-black/50 dark:text-white/50">
            {t("subtitle")}
          </p>
        </div>

        {/* 로그인 폼 */}
        <form className="flex flex-col gap-4">
          {/* ID (이메일) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-black/70 dark:text-white/70"
            >
              {t("emailLabel")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              className="h-11 rounded-lg border border-black/15 bg-transparent px-3.5 text-sm outline-none transition placeholder:text-black/30 focus:border-foreground focus:ring-2 focus:ring-foreground/15 dark:border-white/15 dark:placeholder:text-white/30"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-black/70 dark:text-white/70"
            >
              {t("passwordLabel")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder={t("passwordPlaceholder")}
              className="h-11 rounded-lg border border-black/15 bg-transparent px-3.5 text-sm outline-none transition placeholder:text-black/30 focus:border-foreground focus:ring-2 focus:ring-foreground/15 dark:border-white/15 dark:placeholder:text-white/30"
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

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="h-11 rounded-lg bg-foreground text-sm font-medium text-background transition hover:opacity-90"
          >
            {t("submit")}
          </button>
        </form>

        {/* 회원가입 */}
        <div className="mt-6 flex items-center justify-center gap-1 text-sm">
          <span className="text-black/50 dark:text-white/50">
            {t("noAccount")}
          </span>
          <button
            type="button"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t("signUp")}
          </button>
        </div>
      </div>
    </main>
  );
}
