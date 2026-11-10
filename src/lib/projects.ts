import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";

export type ProjectListItem = { id: string; name: string };

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
