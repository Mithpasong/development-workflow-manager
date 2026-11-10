import { Link } from "next-view-transitions";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import BrandHeader from "@/components/BrandHeader";
import LoginBackground from "@/components/LoginBackground";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const t = useTranslations("Login");

  return (
    <main className="relative flex flex-1 items-center justify-center p-6">
      {/* 배경 파티클 애니메이션 (콘텐츠 뒤) */}
      <LoginBackground />

      {/* 언어 전환 */}
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm">
        {/* 로고 / 브랜드 / 타이틀 */}
        <div className="mb-8">
          <BrandHeader className="mb-10" />

          {/* 로그인 안내 (좌측 정렬) */}
          <div className="text-left">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-2 text-xs text-black/50 dark:text-white/50">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* 로그인 폼 */}
        <LoginForm />

        {/* 회원가입 */}
        <div className="mt-6 flex items-center justify-center gap-1 text-sm">
          <span className="text-black/50 dark:text-white/50">
            {t("noAccount")}
          </span>
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t("signUp")}
          </Link>
        </div>

        {/* 제작자 크레딧 */}
        <p className="mt-6 text-center text-xs text-black/30 dark:text-white/30">
          Created by Mithpasong.kr
        </p>
      </div>
    </main>
  );
}
