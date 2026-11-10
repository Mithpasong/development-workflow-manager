import { Link } from "next-view-transitions";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import BrandHeader from "@/components/BrandHeader";
import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
  const t = useTranslations("SignUp");

  return (
    <main className="relative flex flex-1 items-center justify-center p-6">
      {/* 언어 전환 */}
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm py-10">
        <BrandHeader className="mb-10" />

        {/* 타이틀 */}
        <div className="mb-8 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-xs text-black/50 dark:text-white/50">
            {t("subtitle")}
          </p>
        </div>

        <SignUpForm />

        {/* 로그인으로 이동 */}
        <div className="mt-6 flex items-center justify-center gap-1 text-sm">
          <span className="text-black/50 dark:text-white/50">
            {t("haveAccount")}
          </span>
          <Link
            href="/"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t("signIn")}
          </Link>
        </div>
      </div>
    </main>
  );
}
