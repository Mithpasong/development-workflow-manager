import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserProjects, SELECTED_PROJECT_COOKIE } from "@/lib/projects";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LogoutButton from "@/components/LogoutButton";
import Logo from "@/components/Logo";
import SidebarNav from "@/components/dashboard/SidebarNav";
import ProjectsMenu from "@/components/dashboard/ProjectsMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const t = await getTranslations("Dashboard");
  const projects = await getUserProjects(user.sub);

  // 현재 선택된 프로젝트: 쿠키의 id가 목록에 있으면 그것, 없으면 첫 프로젝트(있을 때).
  const store = await cookies();
  const cookieSelected = store.get(SELECTED_PROJECT_COOKIE)?.value;
  const selected =
    projects.find((p) => p.id === cookieSelected) ?? projects[0] ?? null;

  return (
    <div className="flex flex-1 flex-col">
      {/* 상단 헤더 바 */}
      <header className="relative flex h-11 shrink-0 items-center justify-between border-b border-black/10 px-4 dark:border-white/10">
        {/* 좌측: 사용자 이름 + 이메일 + 로그아웃 */}
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium">{user.name}</span>
          <span className="text-black/50 dark:text-white/50">{user.email}</span>
          <LogoutButton />
        </div>

        {/* 정중앙: 로고 */}
        <Logo className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-auto -translate-x-1/2 -translate-y-1/2 text-foreground" />

        {/* 우측 끝: 언어 선택 */}
        <LanguageSwitcher />
      </header>

      {/* 본문: 좌측 사이드바 + 우측 컨텐츠 */}
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-56 shrink-0 flex-col border-r border-black/10 p-3 dark:border-white/10">
          {/* 현재 선택된 프로젝트명 (항상 표시) */}
          <div className="mb-3 rounded-lg bg-black/5 px-3 py-2 dark:bg-white/10">
            <p className="text-[11px] font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
              {t("currentProject")}
            </p>
            <p
              className="mt-0.5 truncate text-sm font-semibold"
              title={selected?.name ?? undefined}
            >
              {selected ? selected.name : t("noProjectSelected")}
            </p>
          </div>

          <SidebarNav />

          {/* Notification 아래 구분선 (섹션 구분) */}
          <hr className="my-2 border-black/10 dark:border-white/10" />

          <ProjectsMenu projects={projects} selectedId={selected?.id ?? null} />
        </aside>

        <section className="flex-1 overflow-auto p-6">{children}</section>
      </div>
    </div>
  );
}
