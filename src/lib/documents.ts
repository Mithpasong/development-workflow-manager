import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { documents, projects } from "@/db/schema";

export type DocumentListItem = {
  id: string;
  title: string;
  updatedAt: Date;
};

export type DocumentDetail = DocumentListItem & {
  content: string;
  projectId: string;
};

/** 해당 프로젝트가 이 사용자의 것인지 확인한다. */
export async function isProjectOwnedBy(
  projectId: string,
  userId: string,
): Promise<boolean> {
  const rows = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .limit(1);
  return rows.length > 0;
}

/** 프로젝트의 특정 단계 문서 목록 (최근 수정 순서가 아닌 생성 순). */
export async function listDocuments(
  projectId: string,
  step: string,
): Promise<DocumentListItem[]> {
  return db
    .select({
      id: documents.id,
      title: documents.title,
      updatedAt: documents.updatedAt,
    })
    .from(documents)
    .where(and(eq(documents.projectId, projectId), eq(documents.step, step)))
    .orderBy(asc(documents.createdAt));
}

/** 문서 1건 조회 — 소유자(userId) 검증 포함. */
export async function getDocumentForUser(
  documentId: string,
  userId: string,
): Promise<DocumentDetail | null> {
  const [row] = await db
    .select({
      id: documents.id,
      title: documents.title,
      content: documents.content,
      updatedAt: documents.updatedAt,
      projectId: documents.projectId,
    })
    .from(documents)
    .innerJoin(projects, eq(projects.id, documents.projectId))
    .where(and(eq(documents.id, documentId), eq(projects.userId, userId)))
    .limit(1);
  return row ?? null;
}

/** 문서 생성. */
export async function createDocument(
  projectId: string,
  step: string,
  title: string,
): Promise<DocumentListItem> {
  const [row] = await db
    .insert(documents)
    .values({ projectId, step, title })
    .returning({
      id: documents.id,
      title: documents.title,
      updatedAt: documents.updatedAt,
    });
  return row;
}

/** 문서 수정 — 소유자 검증은 호출 전에 수행한다. */
export async function updateDocument(
  documentId: string,
  values: { title: string; content: string },
): Promise<void> {
  await db
    .update(documents)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(documents.id, documentId));
}
