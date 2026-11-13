import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserProjects, SELECTED_PROJECT_COOKIE } from "@/lib/projects";
import { SIDEBAR_COLLAPSED_COOKIE } from "@/lib/ui-preferences";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LogoutButton from "@/components/LogoutButton";
import Logo from "@/components/Logo";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import SidebarNav from "@/components/dashboard/SidebarNav";
import ProjectsMenu from "@/components/dashboard/ProjectsMenu";
import ProjectNav from "@/components/dashboard/ProjectNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  const projects = await getUserProjects(user.sub);

  // 현재 선택된 프로젝트: 쿠키의 id가 목록에 있으면 그것, 없으면 첫 프로젝트(있을 때).
  const store = await cookies();
  const cookieSelected = store.get(SELECTED_PROJECT_COOKIE)?.value;
  const selected =
    projects.find((p) => p.id === cookieSelected) ?? projects[0] ?? null;

  // 사이드바 접힘 상태(서버에서 읽어 초기 렌더부터 반영 → 깜빡임 없음)
  const sidebarCollapsed =
    store.get(SIDEBAR_COLLAPSED_COOKIE)?.value === "1";

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
        <DashboardSidebar initialCollapsed={sidebarCollapsed}>
          <SidebarNav />

          {/*
            Notification 아래 구분선 — aside의 p-2를 상쇄해 가로 전체를 채운다.
            접힘 상태에서도 보이도록 숨김 래퍼 바깥에 둔다.
          */}
          <hr className="-mx-2 mb-2 border-black/10 dark:border-white/10" />

          {/* 접힘 상태에서는 좁은 폭에 표현할 수 없어 드롭다운만 숨긴다 */}
          <div className="group-data-[collapsed=true]/sidebar:hidden">
            <ProjectsMenu
              projects={projects}
              selectedId={selected?.id ?? null}
            />
          </div>

          {/* 프로젝트 메뉴 (접힘 시에는 아이콘만) */}
          <ProjectNav />
        </DashboardSidebar>

        <section className="flex-1 overflow-auto p-6">{children}</section>
      </div>
    </div>
  );
}
