import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";

export type ProjectListItem = { id: string; name: string };

/** 현재 선택된 프로젝트 id를 담는 쿠키 이름. */
export const SELECTED_PROJECT_COOKIE = "selected_project";

/** 특정 사용자의 프로젝트 목록을 생성 순으로 조회한다. */
export async function getUserProjects(
  userId: string,
): Promise<ProjectListItem[]> {
  return db
    .select({ id: projects.id, name: projects.name })
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(asc(projects.createdAt));
}

/** 특정 사용자의 새 프로젝트를 생성한다. */
export async function createProject(
  userId: string,
  name: string,
): Promise<ProjectListItem> {
  const [created] = await db
    .insert(projects)
    .values({ userId, name })
    .returning({ id: projects.id, name: projects.name });
  return created;
}
