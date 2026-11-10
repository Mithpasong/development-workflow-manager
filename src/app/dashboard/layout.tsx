import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LogoutButton from "@/components/LogoutButton";
import SidebarNav from "@/components/dashboard/SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* 상단 헤더 바 */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-black/10 px-4 dark:border-white/10">
        {/* 좌측: 사용자 이름 + 이메일 */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{user.name}</span>
          <span className="text-black/50 dark:text-white/50">{user.email}</span>
        </div>

        {/* 우측 끝: 언어 선택 */}
        <LanguageSwitcher />
      </header>

      {/* 본문: 좌측 사이드바 + 우측 컨텐츠 */}
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-56 shrink-0 flex-col border-r border-black/10 p-3 dark:border-white/10">
          <SidebarNav />
          <div className="mt-auto pt-3">
            <LogoutButton />
          </div>
        </aside>

        <section className="flex-1 overflow-auto p-6">{children}</section>
      </div>
    </div>
  );
}
