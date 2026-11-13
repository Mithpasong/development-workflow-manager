import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Link } from "next-view-transitions";
import { getLocale, getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserProjects, SELECTED_PROJECT_COOKIE } from "@/lib/projects";
import { getDocumentForUser, listDocuments } from "@/lib/documents";
import DocumentEditor from "@/components/documents/DocumentEditor";
import NewDocumentButton from "@/components/documents/NewDocumentButton";

const STEP = "background";

export default async function BackgroundPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const t = await getTranslations("Documents");
  const locale = await getLocale();

  // 사이드바와 동일한 규칙으로 현재 프로젝트를 결정한다.
  const projects = await getUserProjects(user.sub);
  const store = await cookies();
  const cookieSelected = store.get(SELECTED_PROJECT_COOKIE)?.value;
  const project =
    projects.find((p) => p.id === cookieSelected) ?? projects[0] ?? null;

  const heading = (
    <h1 className="text-2xl font-semibold tracking-tight">{t("background")}</h1>
  );

  if (!project) {
    return (
      <div>
        {heading}
        <p className="mt-4 text-sm text-black/50 dark:text-white/50">
          {t("noProject")}
        </p>
      </div>
    );
  }

  const docs = await listDocuments(project.id, STEP);

  const params = await searchParams;
  const raw = params.doc;
  const requestedId = Array.isArray(raw) ? raw[0] : raw;

  // 요청된 문서가 없거나 접근 권한이 없으면 첫 번째 문서를 연다.
  const selectedId =
    docs.find((d) => d.id === requestedId)?.id ?? docs[0]?.id ?? null;
  const selected = selectedId
    ? await getDocumentForUser(selectedId, user.sub)
    : null;

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "short" }).format(d);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {heading}

      {/* 좌: 문서 목록 (좁게) / 우: 선택한 문서 내용 */}
      <div className="mt-6 flex min-h-0 flex-1 gap-6">
        {/* 좌측 패널 */}
        <aside className="flex w-60 shrink-0 flex-col gap-2">
          <p className="px-0.5 text-[10px] font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
            {t("documents")}
          </p>

          <ul className="flex flex-col gap-1">
            {docs.map((doc) => {
              const active = doc.id === selectedId;
              return (
                <li key={doc.id}>
                  <Link
                    href={`?doc=${doc.id}`}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-foreground font-medium text-background"
                        : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
                    }`}
                  >
                    <span className="block truncate">{doc.title}</span>
                    <span
                      className={`mt-0.5 block text-[11px] ${
                        active
                          ? "text-background/70"
                          : "text-black/40 dark:text-white/40"
                      }`}
                    >
                      {formatDate(doc.updatedAt)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <NewDocumentButton projectId={project.id} step={STEP} />
        </aside>

        {/* 우측 패널 */}
        <section className="flex min-h-0 flex-1 flex-col">
          {selected ? (
            <DocumentEditor
              key={selected.id}
              documentId={selected.id}
              initialTitle={selected.title}
              initialContent={selected.content}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-black/15 p-10 text-sm text-black/40 dark:border-white/15 dark:text-white/40">
              {t("emptyState")}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
